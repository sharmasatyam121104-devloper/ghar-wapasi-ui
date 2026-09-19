import Header from './Header'
import Footer from './Footer'

interface InfoSection {
  heading: string
  body: string[]
}

interface InfoCard {
  title: string
  value: string
}

interface InfoPageProps {
  eyebrow: string
  title: string
  description: string
  infoCards?: InfoCard[]
  sections: InfoSection[]
}

function InfoPage({ eyebrow, title, description, infoCards = [], sections }: InfoPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
        {infoCards.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {infoCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{card.title}</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">{card.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <h2 className="font-display text-lg font-bold text-slate-900">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-3 text-sm leading-7 text-slate-600">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default InfoPage