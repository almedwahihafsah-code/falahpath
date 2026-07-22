import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * /qr — dynamic QR destination.
 *
 * A single printed QR code (used in mosques and Qur'an circles) points here.
 * The destination is read from the `qr_redirect` table so it can be changed
 * at any time from the database without reprinting.
 */
const QrRedirect = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("qr_redirect" as any)
        .select("destination_url")
        .eq("id", 1)
        .maybeSingle();
      if (cancelled) return;
      const url = (data as any)?.destination_url;
      if (error || !url) {
        setError("تعذّر تحميل الوجهة");
        return;
      }
      window.location.replace(url);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-background text-center px-6"
    >
      <div className="space-y-3">
        <p className="font-editorial text-2xl text-primary">
          {error ? error : "لحظة… نُوجّهك إلى الوجهة"}
        </p>
        <p className="text-sm text-muted-foreground">falah.me</p>
      </div>
    </div>
  );
};

export default QrRedirect;