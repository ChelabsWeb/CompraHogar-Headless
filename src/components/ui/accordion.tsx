"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionContextType = {
    value: string | string[];
    onValueChange: (value: string) => void;
    type: "single" | "multiple";
    collapsible?: boolean;
};

const AccordionContext = React.createContext<AccordionContextType | null>(null);

function useAccordion() {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error("useAccordion must be used within an Accordion");
    }
    return context;
}

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple";
        collapsible?: boolean;
        defaultValue?: string | string[];
        value?: string | string[];
        onValueChange?: (value: string | string[]) => void;
    }
>(({ className, type = "single", collapsible = false, defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
        defaultValue !== undefined ? defaultValue : (type === "single" ? "" : [])
    );

    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
        (itemValue: string) => {
            let newValue: string | string[];

            if (type === "single") {
                if (value === itemValue && collapsible) {
                    newValue = "";
                } else {
                    newValue = itemValue;
                }
            } else {
                const valueArray = Array.isArray(value) ? value : [];
                if (valueArray.includes(itemValue)) {
                    newValue = valueArray.filter((v) => v !== itemValue);
                } else {
                    newValue = [...valueArray, itemValue];
                }
            }

            setUncontrolledValue(newValue);
            onValueChange?.(newValue);
        },
        [type, collapsible, value, onValueChange]
    );

    return (
        <AccordionContext.Provider
            value={{
                value,
                onValueChange: handleValueChange,
                type,
                collapsible,
            }}
        >
            <div ref={ref} className={className} {...props} />
        </AccordionContext.Provider>
    );
});
Accordion.displayName = "Accordion";

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    return (
        <AccordionItemContext.Provider value={{ value }}>
            <div ref={ref} className={cn("border-b", className)} {...props} />
        </AccordionItemContext.Provider>
    );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value, onValueChange } = useAccordion();
    const itemContext = React.useContext(AccordionItemContext);

    if (!itemContext) {
        throw new Error("AccordionTrigger must be used within an AccordionItem");
    }

    const isOpen = Array.isArray(value)
        ? value.includes(itemContext.value)
        : value === itemContext.value;

    return (
        <h3 className="flex">
            <button
                ref={ref}
                type="button"
                onClick={() => onValueChange(itemContext.value)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </h3>
    );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value } = useAccordion();
    const itemContext = React.useContext(AccordionItemContext);

    if (!itemContext) {
        throw new Error("AccordionContent must be used within an AccordionItem");
    }

    const isOpen = Array.isArray(value)
        ? value.includes(itemContext.value)
        : value === itemContext.value;

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all",
                isOpen ? "animate-accordion-down" : "animate-accordion-up hidden"
            )}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </div>
    );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
