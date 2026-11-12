"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Headset,
  HelpCircle,
  Inbox,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { FAQCategories } from "./faq-categories";
import { FAQSearch } from "./faq-search";
import { categories, questions, type CategoryId, type FAQItem } from "./faq-data";

export function FAQPage() {
  const [active, setActive] = useState<CategoryId>("getting-started");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "yes" | "no">>({});
  const [supportPreview, setSupportPreview] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedCategory = categories.find((category) => category.id === active) ?? categories[0];
  const matches = normalizedQuery
    ? questions.filter((item) => {
        const category = categories.find((group) => group.id === item.categoryId);
        return `${item.question} ${item.answer} ${category?.title ?? ""} ${category?.description ?? ""}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      })
    : questions.filter((item) => item.categoryId === active);

  function selectCategory(id: CategoryId) {
    setActive(id);
    setQuery("");
    setOpenId(null);
  }
  function reveal(item: FAQItem) {
    setQuery("");
    setActive(item.categoryId);
    setOpenId(item.id);
    requestAnimationFrame(() =>
      document.getElementById(`faq-${item.id}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      }),
    );
  }

  return (
    <div className="grid min-w-0 gap-widget">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Help Center" />
          <p className="mt-1 text-[11px] text-muted">
            Answers, guidance, and workspace resources in one place.
          </p>
        </div>
        <Badge>{questions.length} help articles</Badge>
      </div>
      <FAQSearch
        query={query}
        onChange={(value) => {
          setQuery(value);
          setOpenId(null);
        }}
        onClear={() => setQuery("")}
      />
      <FAQCategories active={active} onSelect={selectCategory} />

      <div className="grid min-w-0 items-start gap-widget lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)]">
        <nav
          aria-label="FAQ categories"
          className="min-w-0 rounded-[9px] border border-card-border bg-surface p-2 lg:sticky lg:top-[88px]"
        >
          <p className="hidden px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[.06em] text-muted lg:block">
            Topics
          </p>
          <div className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-current={!normalizedQuery && active === category.id ? "page" : undefined}
                onClick={() => selectCategory(category.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-accent lg:w-full ${!normalizedQuery && active === category.id ? "bg-accent/10 text-accent" : "hover:bg-surface-alt"}`}
              >
                <category.icon size={13} className="shrink-0" />
                <span className="whitespace-nowrap">{category.title}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="grid min-w-0 gap-widget">
          <Card
            title={normalizedQuery ? "Search results" : selectedCategory.title}
            icon={normalizedQuery ? HelpCircle : selectedCategory.icon}
            action={
              <Badge>
                {matches.length} {matches.length === 1 ? "answer" : "answers"}
              </Badge>
            }
          >
            {normalizedQuery && (
              <p role="status" className="mb-3 text-[11px] text-muted">
                {matches.length} {matches.length === 1 ? "result" : "results"} for “{query.trim()}”
                across all topics.
              </p>
            )}
            {matches.length ? (
              <div className="divide-y divide-border">
                {matches.map((item) => {
                  const expanded = openId === item.id;
                  const category = categories.find((group) => group.id === item.categoryId);
                  return (
                    <article
                      key={item.id}
                      id={`faq-${item.id}`}
                      className="scroll-mt-24 py-3 first:pt-0 last:pb-0"
                    >
                      <h3>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`answer-${item.id}`}
                          onClick={() => setOpenId(expanded ? null : item.id)}
                          className="flex w-full items-start justify-between gap-3 text-left text-[12px] font-medium focus-visible:outline-2 focus-visible:outline-accent"
                        >
                          <span className="min-w-0">
                            {item.question}
                            {normalizedQuery && (
                              <span className="mt-1 block text-[10px] font-normal text-muted">
                                {category?.title}
                              </span>
                            )}
                          </span>
                          <ChevronDown
                            size={15}
                            className={`mt-0.5 shrink-0 text-muted transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </h3>
                      {expanded && (
                        <div id={`answer-${item.id}`} className="pt-2">
                          <p className="max-w-3xl text-[11px] leading-5 text-muted">
                            {item.answer}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-2.5 text-[10px]">
                            <span className="mr-1 text-muted">Was this answer helpful?</span>
                            <Button
                              size="sm"
                              variant={feedback[item.id] === "yes" ? "primary" : "outline"}
                              aria-pressed={feedback[item.id] === "yes"}
                              onClick={() =>
                                setFeedback((current) => ({ ...current, [item.id]: "yes" }))
                              }
                            >
                              <ThumbsUp size={11} />
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant={feedback[item.id] === "no" ? "primary" : "outline"}
                              aria-pressed={feedback[item.id] === "no"}
                              onClick={() =>
                                setFeedback((current) => ({ ...current, [item.id]: "no" }))
                              }
                            >
                              <ThumbsDown size={11} />
                              No
                            </Button>
                            {feedback[item.id] && (
                              <span role="status" className="text-accent">
                                Response noted in this preview.
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Inbox size={20} className="mx-auto text-muted" />
                <h3 className="mt-2 text-[12px] font-medium">No matching answers</h3>
                <p className="mt-1 text-[11px] text-muted">Try a shorter term or browse a topic.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </Card>

          <Card title="Popular questions" icon={MessageCircle} action={<Badge>Most viewed</Badge>}>
            <div className="grid gap-x-5 sm:grid-cols-2">
              {questions
                .filter((item) => item.popular)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => reveal(item)}
                    className="flex min-w-0 items-center gap-2 border-b border-border py-2.5 text-left hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-medium">{item.question}</span>
                      <span className="mt-0.5 block text-[9px] text-muted">
                        {categories.find((category) => category.id === item.categoryId)?.title}
                      </span>
                    </span>
                    <ChevronRight size={13} className="shrink-0 text-muted" />
                  </button>
                ))}
            </div>
          </Card>
        </div>
      </div>

      <section
        aria-labelledby="faq-support-title"
        className="flex flex-col gap-4 rounded-[9px] border border-card-border bg-surface px-4 py-4 sm:flex-row sm:items-center sm:px-5"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          <Headset size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="faq-support-title" className="text-[14px] font-semibold">
            Still need help?
          </h2>
          <p className="mt-1 text-[11px] text-muted">
            Explore the answers above or preview how a support handoff would appear.
          </p>
          {supportPreview && (
            <p role="status" className="mt-1 text-[10px] text-accent">
              Support contact is a demo preview; no request was sent.
            </p>
          )}
        </div>
        <Button variant="dark" onClick={() => setSupportPreview(true)}>
          Preview contact support <ArrowUpRight size={13} />
        </Button>
      </section>
    </div>
  );
}
