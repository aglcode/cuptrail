import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import mascot from "@public/brand/cuptrail-mascot.png";

// The landing page ("/"). Placeholder hero — replace with the real design.
export default function LandingPage() {
  return (
    <main
      id="main-content"
      className="page-width flex flex-1 flex-col gap-10 py-10 md:py-16"
    >
      {/* role="note": a static notice shouldn't interrupt screen readers like role="alert". */}
      <Alert
        role="note"
        className="border-primary/40 bg-primary/10 px-5 py-4 *:[svg]:text-primary"
      >
        <Icon name="coffee" className="size-5" />
        <AlertTitle className="text-base font-semibold">Coming soon</AlertTitle>
        <AlertDescription className="text-foreground/80">
          Cuptrail is still brewing. It&apos;s under active development, so
          things may change and the shops you see are sample data for now.
        </AlertDescription>
      </Alert>
      <div className="flex flex-1 flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow mb-3 flex items-center gap-2 text-primary">
            <Icon name="compass" size={16} />
            Your coffee companion
          </p>
          <h1 className="text-4xl md:text-5xl">
            Find your next coffee corner.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover shops by the things that matter — Wi-Fi, outlets, a quiet
            seat — and keep a journal of every good brew.
          </p>
          <LinkButton
            variant="default"
            href="/shops"
            className="button button-accent mt-8"
          >
            Start exploring
            <Icon name="arrow" size={16} />
          </LinkButton>
        </div>
        <Image
          src={mascot}
          alt=""
          width={280}
          height={280}
          sizes="(max-width: 767px) 180px, 280px"
          className="h-auto w-44 md:w-72"
          preload
        />
      </div>
    </main>
  );
}
