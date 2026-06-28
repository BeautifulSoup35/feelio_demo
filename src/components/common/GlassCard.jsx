export default function GlassCard({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component className={`glassCard ${className}`} {...props}>
      {children}
    </Component>
  );
}
