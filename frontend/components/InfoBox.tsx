"use client";

interface InfoBoxProps {
  icon: string;
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
}

export function InfoBox({ icon, children, variant = "info" }: InfoBoxProps) {
  const variantClasses = {
    info: "border-blue-500/20 bg-blue-500/5",
    success: "border-green-500/20 bg-green-500/5",
    warning: "border-orange-500/20 bg-orange-500/5",
    error: "border-red-500/20 bg-red-500/5",
  };

  return (
    <div className={`glass rounded-xl p-4 border ${variantClasses[variant]}`}>
      <div className="flex items-start gap-3 text-sm">
        <span className="text-2xl">{icon}</span>
        <div className="text-gray-400">{children}</div>
      </div>
    </div>
  );
}

export function SigningInfoBox() {
  return (
    <InfoBox icon="💡">
      <p>
        <span className="text-green-400">90%</span> goes to the guestbook owner
      </p>
      <p>
        <span className="text-blue-400">10%</span> platform fee
      </p>
      <p className="text-purple-400 mt-1">First signature earns you a SIGNER badge! 🏅</p>
    </InfoBox>
  );
}
