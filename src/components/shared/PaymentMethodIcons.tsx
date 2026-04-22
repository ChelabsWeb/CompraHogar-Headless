import React from "react";

const BASE_WIDTH = 56;
const BASE_HEIGHT = 36;

interface IconProps {
    className?: string;
}

function Card({
    children,
    className = "",
    label,
}: {
    children: React.ReactNode;
    className?: string;
    label: string;
}) {
    return (
        <div
            role="img"
            aria-label={label}
            className={`inline-flex items-center justify-center bg-white border border-slate-200 rounded-md shadow-sm ${className}`}
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
        >
            {children}
        </div>
    );
}

export function VisaIcon({ className }: IconProps) {
    return (
        <Card label="Visa" className={className}>
            <svg
                viewBox="0 0 48 16"
                width="44"
                height="14"
                fill="none"
                aria-hidden="true"
            >
                <text
                    x="0"
                    y="13"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="15"
                    fontStyle="italic"
                    letterSpacing="-0.5"
                    fill="#1A1F71"
                >
                    VISA
                </text>
            </svg>
        </Card>
    );
}

export function MastercardIcon({ className }: IconProps) {
    return (
        <Card label="Mastercard" className={className}>
            <svg
                viewBox="0 0 40 24"
                width="34"
                height="20"
                aria-hidden="true"
            >
                <circle cx="15" cy="12" r="9" fill="#EB001B" />
                <circle cx="25" cy="12" r="9" fill="#F79E1B" />
                <path
                    d="M20 5.5a9 9 0 000 13 9 9 0 000-13z"
                    fill="#FF5F00"
                />
            </svg>
        </Card>
    );
}

export function OcaIcon({ className }: IconProps) {
    return (
        <Card label="OCA" className={className}>
            <svg
                viewBox="0 0 48 16"
                width="40"
                height="14"
                fill="none"
                aria-hidden="true"
            >
                <text
                    x="24"
                    y="13"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="14"
                    letterSpacing="0.5"
                    fill="#002664"
                >
                    OCA
                </text>
            </svg>
        </Card>
    );
}

export function AbitabIcon({ className }: IconProps) {
    return (
        <Card label="Abitab" className={className}>
            <svg
                viewBox="0 0 60 16"
                width="46"
                height="14"
                fill="none"
                aria-hidden="true"
            >
                <text
                    x="30"
                    y="13"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="13"
                    letterSpacing="-0.3"
                    fill="#E31937"
                >
                    Abitab
                </text>
            </svg>
        </Card>
    );
}

export function RedPagosIcon({ className }: IconProps) {
    return (
        <Card label="RedPagos" className={className}>
            <svg
                viewBox="0 0 60 16"
                width="48"
                height="12"
                fill="none"
                aria-hidden="true"
            >
                <text
                    x="0"
                    y="12"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="11"
                    letterSpacing="-0.2"
                    fill="#E30613"
                >
                    Red
                </text>
                <text
                    x="20"
                    y="12"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="11"
                    letterSpacing="-0.2"
                    fill="#004B93"
                >
                    Pagos
                </text>
            </svg>
        </Card>
    );
}

export function TransferenciaIcon({ className }: IconProps) {
    return (
        <Card label="Transferencia bancaria" className={className}>
            <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M3 21h18" />
                <path d="M5 21V10l7-5 7 5v11" />
                <path d="M9 21v-6h6v6" />
            </svg>
        </Card>
    );
}

export function PaymentMethodIcons({ className = "" }: { className?: string }) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
            <VisaIcon />
            <MastercardIcon />
            <OcaIcon />
            <AbitabIcon />
            <RedPagosIcon />
            <TransferenciaIcon />
        </div>
    );
}
