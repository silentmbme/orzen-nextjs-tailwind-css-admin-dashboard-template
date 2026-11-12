import { categories, questions, type CategoryId } from "./faq-data";

export function FAQCategories({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <section aria-labelledby="faq-topics">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 id="faq-topics" className="text-[13px] font-semibold">
          Browse by topic
        </h2>
        <span className="text-[10px] text-muted">{questions.length} questions</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => onSelect(category.id)}
            className={`flex min-w-0 items-start gap-3 rounded-[9px] border bg-surface p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${active === category.id ? "border-accent" : "border-card-border hover:border-accent/40"}`}
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-md ${category.accent}`}
            >
              <category.icon size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block text-[11px] font-semibold">{category.title}</b>
              <span className="mt-0.5 block text-[10px] leading-4 text-muted">
                {category.description}
              </span>
            </span>
            <span className="text-[10px] text-muted">
              {questions.filter((item) => item.categoryId === category.id).length}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
