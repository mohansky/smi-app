import ClassesPreview from "../sections/classes-preview";
import { Container } from "../custom-ui/container";
import { classes } from "#site/content";

export default function ClassesList() {
  const orderedProducts = classes.sort((classe1, classe2) =>
    classe1.weight > classe2.weight ? 1 : -1
  );
  const displayClasses = orderedProducts.filter((classe) => classe.published);
  return (
    <>
      <Container width="nomargin">
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {displayClasses.map((classe) => (
            <div key={classe.slug}>
              <ClassesPreview
                key={classe.slug}
                title={classe.title}
                description={classe.description}
                duration={classe.duration}
                fees={classe.fees}
                crashCourse={classe.crashCourse}
                slug={classe.slug}
                img={classe.img}
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
