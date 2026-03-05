"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OctagonAlert } from "lucide-react";
import { Streamdown } from "streamdown";
import { useTranslation } from "@/lib/i18n";

export default function NotificationBanner() {
    const t = useTranslation();

    return (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <OctagonAlert strokeWidth={3} />
            <AlertTitle className="font-semibold uppercase">
                {t.misc.important}
            </AlertTitle>
            <AlertDescription>
                <Streamdown
                    linkSafety={{ enabled: false }}
                    className="font-medium"
                >
                    Re: Data source changes and some features temporarily not
                    available. See details [here](/notifications).
                </Streamdown>
                <span className="text-xs font-medium">01/03/2026</span>
            </AlertDescription>
        </Alert>
    );
}
