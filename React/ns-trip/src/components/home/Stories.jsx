import { stories } from '../../utils/content'
import Button from '../ui/Button'
import MediaPlaceholder from '../ui/MediaPlaceholder'

export default function Stories() {
  return (
    <section id="stories" className="bg-paper py-[4.75rem]">
      <div className="frame">
        <div data-reveal-component className="mb-[2.4rem] flex items-end justify-between gap-6">
          <h2 data-reveal="heading" className="text-h2">
            {stories.title}
          </h2>
          <div data-reveal="fade">
            <Button href="#stories">View all</Button>
          </div>
        </div>

        <div className="-mx-[var(--spacing-margin)] flex snap-x scroll-px-[var(--spacing-margin)] gap-[1.45rem] overflow-x-auto px-[var(--spacing-margin)] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {stories.items.map((story) => (
            <article
              key={story.title}
              data-cursor-hover
              data-cursor-text="Read story"
              className="relative flex w-[20rem] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-sage lg:w-auto"
            >
              {story.image ? (
                <img src={story.image} alt={story.alt ?? ''} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              ) : (
                <MediaPlaceholder label="Cover image" className="aspect-square w-full" />
              )}
              <div className="flex min-h-[17.8rem] flex-1 flex-col justify-between gap-10 px-5 py-6">
                <h3 className="text-h5">
                  <a href="#stories" className="after:absolute after:inset-0">
                    {story.title}
                  </a>
                </h3>
                <div className="flex items-center justify-between gap-4 text-small">
                  <span className="rounded-[4px] border border-accent px-2 py-1">{story.tag}</span>
                  <span className="text-ink/75">{story.meta}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
