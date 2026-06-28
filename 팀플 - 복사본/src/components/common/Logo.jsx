import { FeelioMark } from './Icons.jsx';

export default function Logo({ compact = false }) {
  return (
    <div className="logoRow">
      <div className="logoMark"><FeelioMark /></div>
      {!compact && (
        <div>
          <div className="brandName">Feelio</div>
          <div className="brandCaption">Feel + I/O</div>
        </div>
      )}
    </div>
  );
}
