import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTeamMembers } from '../hooks/useTeamMembers';

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const sectionRef = useRef(null);
  const { members, loading } = useTeamMembers();

  useEffect(() => {
    if (loading || members.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: '.about-us > h1', end: '+=400', scrub: true },
      }).from('.about-us > h1', 2, { opacity: 0, y: -100, ease: 'power2.out' });

      members.forEach((_, index) => {
        const isImageFirst = index % 2 === 0;
        const imgSelector = `.member-image-container.m${index + 1}`;
        const contentSelector = `.member-content.m${index + 1}`;
        const imgDir = isImageFirst ? -100 : 100;
        const contentDir = isImageFirst ? 100 : -100;

        gsap.timeline({
          scrollTrigger: { trigger: imgSelector, end: '+=400', scrub: true },
        }).from(imgSelector, 2, { opacity: 0, x: imgDir, ease: 'power2.out' });

        gsap.timeline({
          scrollTrigger: { trigger: contentSelector, end: '+=400', scrub: true },
        }).from(contentSelector, 2, { opacity: 0, x: contentDir, ease: 'power2.out' });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, members.length]);

  return (
    <section className="about-us" ref={sectionRef}>
      <h1>Meet our team</h1>
      <div className="members-details-container">
        <div className="member-container m0">
          <p>
            At Anil Chauhan Photography, we are more than just a studio; we are storytellers who
            capture the magic of your moments with precision and passion. Our team of dedicated
            professionals brings a wealth of experience and creativity to every shoot, ensuring
            that each image is a true reflection of your story.
          </p>
        </div>

        {members.map((member, index) => {
          const isImageFirst = index % 2 === 0;
          const cls = `m${index + 1}`;

          return (
            <div key={member.id}>
              <div className={`member-container ${cls}`}>
                {isImageFirst ? (
                  <>
                    <div className={`member-image-container ${cls}`}>
                      <img className="member-image" src={member.image} alt={member.name} loading="lazy" />
                    </div>
                    <div className="width-separator" />
                    <div className="member-content-container">
                      <div className={`member-content ${cls}`}>
                        <h3>{member.name}</h3>
                        {member.designation && <h5>{member.designation}</h5>}
                        <p>{member.profile_description}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="member-content-container">
                      <div className={`member-content ${cls}`}>
                        <h3>{member.name}</h3>
                        {member.designation && <h5>{member.designation}</h5>}
                        <p>{member.profile_description}</p>
                      </div>
                    </div>
                    <div className="width-separator" />
                    <div className={`member-image-container ${cls}`}>
                      <img className="member-image" src={member.image} alt={member.name} loading="lazy" />
                    </div>
                  </>
                )}
              </div>
              {index < members.length - 1 && <div className="height-separator" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
