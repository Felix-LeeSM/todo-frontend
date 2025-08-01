import { Button, buttonVariants } from "@domain/shared/components/ui/button";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { type DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { mergeClassNames } from "@/shared/mergeClassNames";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      locale={ko}
      showOutsideDays={showOutsideDays}
      className={mergeClassNames(
        "bg-background group/calendar p-3 m-0.5 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: mergeClassNames("w-fit", defaultClassNames.root),
        months: mergeClassNames("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: mergeClassNames("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: mergeClassNames(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: mergeClassNames(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: mergeClassNames(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: mergeClassNames(
          "flex items-center justify-center h-[--cell-size] w-full px-[--cell-size]",
          defaultClassNames.month_caption,
        ),
        dropdowns: mergeClassNames(
          "w-full flex items-center text-sm font-medium justify-center h-[--cell-size] gap-1.5",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: mergeClassNames(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[2px] rounded-md",
          defaultClassNames.dropdown_root,
        ),
        dropdown: mergeClassNames("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: mergeClassNames(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: mergeClassNames("flex", defaultClassNames.weekdays),
        weekday: mergeClassNames(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday,
        ),
        week: mergeClassNames("flex w-full mt-2", defaultClassNames.week),
        week_number_header: mergeClassNames("select-none w-[--cell-size]", defaultClassNames.week_number_header),
        week_number: mergeClassNames("text-[0.8rem] select-none text-muted-foreground", defaultClassNames.week_number),
        day: mergeClassNames(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        range_start: mergeClassNames("rounded-l-md bg-accent", defaultClassNames.range_start),
        range_middle: mergeClassNames("rounded-none", defaultClassNames.range_middle),
        range_end: mergeClassNames("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: mergeClassNames(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: mergeClassNames(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: mergeClassNames("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: mergeClassNames("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={mergeClassNames(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={mergeClassNames("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={mergeClassNames("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={mergeClassNames("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">{children}</div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={mergeClassNames(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square w-full min-w-[--cell-size] flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[2px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar };
