import Link from "next/link";
import Image from "next/image";

interface AuthShellProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    /** Appears below the card, usually a "¿Ya tenés cuenta? / Iniciá sesión" link. */
    footer?: React.ReactNode;
}

/**
 * Shared layout for all auth pages (login, registro, olvide-password,
 * recuperar-password). Gives them a consistent look: logo on top as a
 * home link (so a visitor who landed here with no header can still
 * escape), centered card with soft background, optional icon badge.
 */
export function AuthShell({ children, title, description, icon, footer }: AuthShellProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] px-4 py-10">
            <div className="w-full max-w-md">
                {/* Logo — doubles as "back to home" */}
                <div className="flex justify-center mb-6">
                    <Link href="/" aria-label="Volver al inicio" className="inline-block">
                        <Image
                            src="/logocomprahogar.png"
                            alt="CompraHogar"
                            width={180}
                            height={48}
                            priority
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                        {icon && (
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                {icon}
                            </div>
                        )}
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>

                {footer && (
                    <div className="mt-6 text-center text-sm text-slate-500">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
