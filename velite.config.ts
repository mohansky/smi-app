import { defineConfig, defineCollection, s } from "velite"; 

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const options = defineCollection({
  name: "Options",
  pattern: "options/index.yml",
  single: true,
  schema: s.object({
    name: s.string().max(99),
    title: s.string().max(99),
    logo: s.string().optional(),
    basepath: s.string().url(),
    description: s.string().max(999).optional(),
    intro: s.string().optional(),
    keywords: s.array(s.string()),
    author: s.object({
      name: s.string(),
      email: s.string().email(),
      url: s.string().url(),
    }),
    heroslider: s.array(
      s.object({
        title: s.string(),
        subtitle: s.string().optional(),
        image: s.string().optional(),
        btnText: s.string(),
        link: s.string(),
      })
    ),
    links: s.array(s.object({ text: s.string(), link: s.string() })),
    socials: s.array(
      s.object({
        name: s.string(),
        icon: s.string(),
        link: s.string(),
        image: s.image().optional(),
      })
    ),
    faq: s.array(s.object({ question: s.string(), answer: s.string() })),
    timmings: s.array(
      s.object({
        day: s.string(),
        time: s.string(),
      })
    ),
    contact: s.array(
      s.object({ href: s.string(), icon: s.string(), name: s.string() })
    ),
    address: s.object({
      href: s.string(),
      icon: s.string(),
      name: s.array(s.string()),
    }),
    about: s.object({
      title: s.string(),
      image: s.string(),
      description: s.string(),
      body: s.array(s.string()),
    }),
    classesTitle: s.string(),
    featuredVideo: s.string().optional(),
    gallery: s.array(
      s.object({
        title: s.string(),
        image: s.string(),
      })
    ),
  }),
});

const classes = defineCollection({
  name: "Classes",
  pattern: "classes/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.excerpt().optional(),
      weight: s.number(),
      slug: s.path(),
      published: s.boolean().default(true),
      img: s.string().optional(),
      duration: s.string().optional(),
      admission: s.string().optional(),
      fees: s.string().optional(),
      crashCourse: s.string().optional(),
      overview: s.array(s.string()),
      body: s.mdx(),
    })
    .transform(computedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { options, classes },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
});
