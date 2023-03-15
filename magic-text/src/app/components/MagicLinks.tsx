import { navigation } from "./links";
import Link from "next/link";

export default function Example() {
  return (
    <section id="links">
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Magic by <Link href="https://jxnl.co">Jason</Link>
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Large Language Model Playground
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              I{"'"}m currently revamping my site to make it easier to use. Hit
              me up on my socials or{" "}
              <a
                href="mailto:jason+magic@jxnl.co"
                className="underline underline-offset-4"
              >
                email
              </a>{" "}
              me if you have any questions. Click any of these links to get
              started.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {navigation.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="relative pl-16 opacity-80 hover:opacity-100"
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.desc}
                  </dd>
                </Link>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
