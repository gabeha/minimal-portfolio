import { SectionCollapsible } from "@/components/section-collapsible";
import { TimelineCollapsible } from "@/components/timeline-collapsible";
import { Separator } from "@/components/ui/separator";

const educationTimelineItems = [
  {
    title: "MSc Software Engineering (Part-Time)",
    date: "(10/2024 - 07/2026)",
    location: "University of Oxford, Oxford, United Kingdom",
    subitems: [
      {
        category: "Subjects",
        description:
          "Object-Oriented Programming, Domain-Driven Design, Algorithms, Deep Neural Networks, Machine Learning",
      },
    ],
  },
  {
    title: "BSc Physics and Mathematics",
    date: "(02/2020 - 02/2023)",
    location: "Maastricht University, Maastricht, Netherlands",
    subitems: [
      {
        category: "Achievements",
        description:
          "Graduated with summa cum laude distinction and a GPA of 8.7",
      },
      {
        category: "Thesis",
        description:
          "Formulation, Optimization and Automation of the University Course Timetabling Problem at the Maastricht Science Programme",
      },
      {
        category: "Subjects",
        description:
          "Linear Algebra, Multivariable Calculus, Optimization, Differential Equations, Data Analysis, Special Relativity, General Relativity, Quantum Theory",
      },
    ],
  },
];

const workTimelineItems = [
  {
    title: "Software Engineer",
    date: "(02/2023 - Present)",
    location: "Maastricht University, Maastricht, Netherlands",
    subitems: [
      {
        category: "Projects",
        description:
          "Building a custom CMS with audit trail, RBAC, SSO, course registration, recommender algorithm, and advanced scheduling",
      },
    ],
  },
  {
    title: "Software Developer Intern",
    date: "(04/2022 - 09/2022)",
    location: "Flowt LLC, Florida, United States of America",
    subitems: [
      {
        category: "Projects",
        description:
          "Enhanced an existing full-stack application with new features, redesigned the front-end, and integrated Google OAuth and Stripe payment.",
      },
    ],
  },
];

const skillsSectionItems = [
  {
    category: "Programming Languages",
    description: "JavaScript, TypeScript, Python, Java, HTML, CSS, SQL",
  },
  {
    category: "Frameworks",
    description:
      "React, Next.js, Vue.js, Node.js, Express.js, Flask, Tensorflow",
  },
  {
    category: "Tools",
    description: "Git, Docker, Azure, SSO, RBAC",
  },
];

export default function Home() {
  return (
    <div className="w-full space-y-4">
      {/* Profile section */}
      <section>
        <h2 className="text-xl sm:text-2xl text-center">Profile</h2>
        <div className="space-y-2">
          <p>
            Gabriel is a software engineer with a passion for building beautiful
            and functional web applications. He is based in Oxford and
            Maastricht. When not coding, he plays football, rows, reads and
            takes photos.
          </p>
          <p>
            Currently working as a software engineer at Maastricht University
            whilst pursuing an MSc in Software Engineering at the University of
            Oxford.
          </p>
        </div>
      </section>
      <Separator className="bg-black" />
      {/* Education section */}
      <section>
        <TimelineCollapsible
          timelineItems={educationTimelineItems}
          title={"Education"}
        />
      </section>
      <Separator className="bg-black" />
      {/* Work section */}
      <section>
        <TimelineCollapsible
          timelineItems={workTimelineItems}
          title={"Work Experience"}
        />
      </section>
      <Separator className="bg-black" />
      {/* Skills section */}
      <section>
        <SectionCollapsible
          title={"Skills"}
          sectionItems={skillsSectionItems}
        />
      </section>
    </div>
  );
}
