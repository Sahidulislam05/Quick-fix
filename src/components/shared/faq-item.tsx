type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-xl border bg-card p-4 open:bg-accent/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
        {question}
        <span className="shrink-0 text-lg text-muted-foreground transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground">{answer}</p>
    </details>
  );
}
