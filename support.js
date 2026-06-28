class DCLogic {
  constructor() {
    this.state = {};
  }
  setState(updater) {
    if (typeof updater === 'function') {
      this.state = { ...this.state, ...updater(this.state) };
    } else {
      this.state = { ...this.state, ...updater };
    }
    if (window.__dcInstance) {
      window.__dcInstance._render();
    }
  }
}
window.DCLogic = DCLogic;

document.addEventListener('DOMContentLoaded', () => {
  const xDcEl = document.querySelector('x-dc');
  if (!xDcEl) return;

  const templateContainer = document.createElement('div');
  templateContainer.innerHTML = xDcEl.innerHTML;
  xDcEl.innerHTML = '';

  const scriptEl = document.querySelector('script[data-dc-script]');
  if (!scriptEl) return;

  let props = {};
  const propsAttr = scriptEl.getAttribute('data-props');
  if (propsAttr) {
    try {
      const decoded = propsAttr.replace(/&quot;/g, '"');
      props = JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to parse data-props', e);
    }
  }

  const scriptCode = scriptEl.textContent;
  try {
    const ComponentClass = new Function('DCLogic', `${scriptCode}\nreturn Component;`)(DCLogic);
    const instance = new ComponentClass();
    window.__dcInstance = instance;

    const defaultState = {};
    for (const key in props) {
      if (props[key] && props[key].default !== undefined) {
        defaultState[key] = props[key].default;
      }
    }
    instance.state = { ...defaultState, ...instance.state };

    instance._render = () => {
      // Backup input focus state to prevent keyboard loss during input typing
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      const selectionStart = isInputFocused ? activeEl.selectionStart : null;
      const selectionEnd = isInputFocused ? activeEl.selectionEnd : null;
      const activePlaceholder = isInputFocused ? activeEl.getAttribute('placeholder') : null;

      const vals = instance.renderVals ? instance.renderVals() : {};
      const clone = templateContainer.cloneNode(true);

      evaluateNode(clone, vals);

      xDcEl.innerHTML = '';
      while (clone.firstChild) {
        xDcEl.appendChild(clone.firstChild);
      }

      // Restore input focus state
      if (isInputFocused) {
        const inputToFocus = activePlaceholder 
          ? document.querySelector(`input[placeholder="${activePlaceholder}"], textarea[placeholder="${activePlaceholder}"]`)
          : document.querySelector('input, textarea');
        if (inputToFocus) {
          inputToFocus.focus();
          if (selectionStart !== null && selectionEnd !== null) {
            try {
              inputToFocus.setSelectionRange(selectionStart, selectionEnd);
            } catch (e) {}
          }
        }
      }
    };

    function evaluateNode(node, context) {
      if (!node) return;

      // 1. sc-if 태그 처리
      if (node.tagName && node.tagName.toLowerCase() === 'sc-if') {
        const valExpr = node.getAttribute('value');
        const cond = evaluateExpression(valExpr, context);
        if (!cond) {
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
          return;
        } else {
          const parent = node.parentNode;
          if (!parent) return;
          const fragment = document.createDocumentFragment();
          const children = Array.from(node.childNodes).map(c => c.cloneNode(true));
          children.forEach(child => {
            fragment.appendChild(child);
          });
          Array.from(fragment.childNodes).forEach(child => {
            evaluateNode(child, context);
          });
          parent.replaceChild(fragment, node);
          return;
        }
      }

      // 2. sc-for 태그 처리
      if (node.tagName && node.tagName.toLowerCase() === 'sc-for') {
        const listExpr = node.getAttribute('list');
        const asVar = node.getAttribute('as') || 'item';
        const list = evaluateExpression(listExpr, context) || [];
        
        const parent = node.parentNode;
        if (!parent) return;
        const fragment = document.createDocumentFragment();
        
        list.forEach((item, index) => {
          const loopContext = { ...context, [asVar]: item, index };
          const loopFragment = document.createDocumentFragment();
          const children = Array.from(node.childNodes).map(c => c.cloneNode(true));
          children.forEach(child => {
            loopFragment.appendChild(child);
          });
          Array.from(loopFragment.childNodes).forEach(child => {
            evaluateNode(child, loopContext);
          });
          fragment.appendChild(loopFragment);
        });
        
        parent.replaceChild(fragment, node);
        return;
      }

      // 3. 일반 엘리먼트 노드 처리
      if (node.nodeType === Node.ELEMENT_NODE) {
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          const name = attr.name;
          const value = attr.value;
          
          if (value.includes('{{')) {
            if (name.startsWith('on')) {
              const eventName = name.slice(2).toLowerCase();
              const expr = value.replace(/[{}\s]/g, '');
              const handler = evaluatePath(expr, context);
              if (typeof handler === 'function') {
                node.addEventListener(eventName, handler);
              }
              node.removeAttribute(name);
            } else {
              const replaced = value.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, expr) => {
                const val = evaluateExpression(`{{${expr}}}`, context);
                return val !== undefined ? val : '';
              });
              node.setAttribute(name, replaced);
            }
          }
        });
        
        const children = Array.from(node.childNodes);
        children.forEach(child => evaluateNode(child, context));
      }
      
      // 4. 텍스트 노드 처리
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (text.includes('{{')) {
          node.nodeValue = text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, expr) => {
            const val = evaluateExpression(`{{${expr}}}`, context);
            return val !== undefined ? val : '';
          });
        }
      }
    }

    function evaluateExpression(expr, context) {
      if (!expr) return undefined;
      const cleanExpr = expr.replace(/[{}]/g, '').trim();
      return evaluatePath(cleanExpr, context);
    }

    function evaluatePath(path, context) {
      if (path === 'true') return true;
      if (path === 'false') return false;
      if (path === 'null') return null;
      
      const parts = path.split('.');
      let current = context;
      for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
      }
      return current;
    }

    instance._render();
    if (instance.componentDidMount) {
      instance.componentDidMount();
    }

  } catch (err) {
    console.error('Error initializing DC Component', err);
  }
});
