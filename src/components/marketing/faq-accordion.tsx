export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="max-w-[800px] border-t border-border">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-border py-5">
          <summary className="flex list-none items-center justify-between gap-4 text-[14px] font-medium">
            {item.question}
            <span
              aria-hidden="true"
              className="text-lg font-normal text-muted group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-[680px] text-[13px] leading-7 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
