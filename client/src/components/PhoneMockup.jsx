export default function PhoneMockup({ children, light = false }) {
  return (
    <div className={`phone-frame ${light ? 'phone-frame-light' : ''}`}>
      <div className="phone-screen">
        {children}
      </div>
    </div>
  );
}
