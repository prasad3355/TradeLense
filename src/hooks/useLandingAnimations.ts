import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function useLandingAnimations(scopeRef: RefObject<HTMLElement | null>) {
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            // Setup initial states
            const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Identify DOM elements
            const navbar = document.querySelector('[data-animation="navbar"]');
            const heroHeading = document.querySelector('[data-animation="hero-heading"]');
            const heroLine1 = heroHeading?.querySelector('span.text-cream');
            const heroLine2 = heroHeading?.querySelector('span.text-tradelense-gradient');
            const heroSubtitle = document.querySelector('[data-animation="hero-subtitle"]');
            const heroActions = document.querySelector('[data-purpose="hero-actions"]');
            const heroTrust = document.querySelector('[data-animation="hero-trust"]');

            // 1. Initial State (Set before rendering frame)
            gsap.set([heroLine1, heroLine2, heroSubtitle, heroActions, heroTrust], { y: 20, opacity: 0 });
            gsap.set(navbar, { opacity: 0, y: -15 });

            // === 1. HERO ANIMATION (Initial Page Load) ===
            heroTimeline
                .to(navbar, { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }, 0)
                .to(heroLine1, { y: 0, opacity: 1, duration: 0.5 }, 0.2)
                .to(heroLine2, { y: 0, opacity: 1, duration: 0.5 }, 0.3)
                .to(heroSubtitle, { y: 0, opacity: 1, duration: 0.4 }, 0.45)
                .to(heroActions, { y: 0, opacity: 1, duration: 0.4 }, 0.55)
                .to(heroTrust, { y: 0, opacity: 1, duration: 0.4 }, 0.65);

            // === 2. DASHBOARD SECTION (Scroll Depth Transition) ===
            const dashboardSection = document.getElementById('dashboard');
            const dashboardEl = document.querySelector('[data-purpose="os-dashboard-window"]');

            if (dashboardSection && dashboardEl) {
                // Deep reveal for dashboard
                gsap.set(dashboardEl, { y: 40, scale: 0.97, opacity: 0 });

                ScrollTrigger.create({
                    trigger: dashboardSection,
                    start: 'top 85%',
                    animation: gsap.to(dashboardEl, {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    }),
                });

                // Stagger inner widgets
                const internals = dashboardEl.querySelectorAll('.grid > div');
                if (internals.length > 0) {
                    gsap.set(internals, { y: 20, opacity: 0 });
                    ScrollTrigger.create({
                        trigger: dashboardEl,
                        start: 'top 75%',
                        animation: gsap.to(internals, {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: 'power2.out'
                        })
                    });
                }
            }

            // === 3. FOUR-PILLAR FEATURE SECTION ===
            const featureCards = gsap.utils.toArray('[data-animation="feature-card"]');
            if (featureCards.length > 0) {
                gsap.set(featureCards, { y: 30, opacity: 0 });
                ScrollTrigger.create({
                    trigger: '#features',
                    start: 'top 75%',
                    animation: gsap.to(featureCards, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power3.out'
                    })
                });
            }

            // === 4. ADVANCED TRADING ANALYTICS ===
            const analyticsTitle = document.querySelector('[data-animation="analytics-title"]');
            const analyticsHud = document.querySelector('[data-purpose="analytics-hud"]');

            if (analyticsTitle && analyticsHud) {
                gsap.set(analyticsTitle, { y: 20, opacity: 0 });
                gsap.set(analyticsHud, { scale: 0.98, opacity: 0 });

                const tlAnalytics = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#analytics',
                        start: 'top 80%',
                    }
                });

                tlAnalytics
                    .to(analyticsTitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
                    .to(analyticsHud, { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3');
            }

            // === 5. AI COACH SECTION ===
            const aiContent = document.querySelector('[data-animation="ai-content"]');
            const aiChat = document.querySelector('[data-animation="ai-chat"]');

            if (aiContent && aiChat) {
                gsap.set(aiContent, { x: 30, opacity: 0 });
                gsap.set(aiChat, { x: -30, opacity: 0 });

                const tlAI = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#ai-coach',
                        start: 'top 75%',
                    }
                });

                tlAI
                    .to(aiChat, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0)
                    .to(aiContent, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);
            }

            // === 6. WORKFLOW SECTION ===
            const workflowItems = gsap.utils.toArray('[data-animation="workflow-item"]');
            if (workflowItems.length > 0) {
                gsap.set(workflowItems, { y: 20, opacity: 0 });
                ScrollTrigger.create({
                    trigger: '#workflow',
                    start: 'top 80%',
                    animation: gsap.to(workflowItems, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.15,
                        ease: 'power2.out'
                    })
                });
            }

            // === 7. PRICING SECTION ===
            const pricingHeading = document.querySelector('[data-animation="pricing-heading"]');
            const pricingCards = gsap.utils.toArray('[data-animation="pricing-card"]') as HTMLElement[];

            if (pricingHeading && pricingCards.length === 3) {
                const pricingTitleSpan = pricingHeading.querySelector('span');
                const pricingH2 = pricingHeading.querySelector('h2');
                const pricingSubHeading = pricingHeading.querySelector('p');

                gsap.set([pricingTitleSpan, pricingH2], { y: 25, opacity: 0 });
                gsap.set(pricingSubHeading, { y: 18, opacity: 0 });
                gsap.set(pricingCards, { y: 35, scale: 0.97, opacity: 0 });

                const proCard = pricingCards[1];
                const proSweepContainer = proCard.querySelector('[data-pricing-element="sweep"]');
                const proSweepInner = proCard.querySelector('[data-pricing-element="sweep-inner"]');
                const badge = proCard.querySelector('[data-pricing-element="badge"]');

                if (badge) gsap.set(badge, { y: -8, scale: 0.94, opacity: 0 });

                pricingCards.forEach(card => {
                    const title = card.querySelector('[data-pricing-element="title"]');
                    const price = card.querySelector('[data-pricing-element="price"]');
                    const desc = card.querySelector('[data-pricing-element="desc"]');
                    const features = card.querySelectorAll('[data-pricing-element="feature"]');
                    const cta = card.querySelector('[data-pricing-element="cta"]');

                    gsap.set([title, price, desc, cta], { y: 14, opacity: 0 });
                    gsap.set(features, { y: 8, opacity: 0 });

                    // Hover interaction (Desktop only)
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                        const hoverAnim = gsap.to(card, {
                            y: card === proCard ? -4 : -3,
                            ease: 'power2.out',
                            duration: 0.2,
                            paused: true
                        });
                        card.addEventListener('mouseenter', () => hoverAnim.play());
                        card.addEventListener('mouseleave', () => hoverAnim.reverse());
                    }
                });

                const tlPricing = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#pricing',
                        start: 'top 75%',
                    }
                });

                // 1. Reveal headers
                tlPricing
                    .to([pricingTitleSpan, pricingH2, pricingSubHeading], {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out'
                    })

                    // 2. Cinematic Three-Card reveal 
                    .to(pricingCards, {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.14,
                        ease: 'power3.out'
                    }, '-=0.2')

                    // 3. Pro Card Hero Moment + Glow Intensify
                    .to(proCard, {
                        scale: 1.015,
                        boxShadow: 'rgba(168, 85, 247, 0.5) 0px 0px 45px -5px, rgba(0, 240, 255, 0.4) 0px 0px 25px -5px',
                        duration: 0.5,
                        yoyo: true, // yoyo back to normal to keep UI locked
                        repeat: 1,
                        ease: 'power2.out'
                    }, '-=0.2')

                // Badge pops in
                if (badge) {
                    tlPricing.to(badge, {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'back.out(1.5)'
                    }, '-=0.4');
                }

                // Inner content reveal
                pricingCards.forEach((card, i) => {
                    const title = card.querySelector('[data-pricing-element="title"]');
                    const price = card.querySelector('[data-pricing-element="price"]');
                    const desc = card.querySelector('[data-pricing-element="desc"]');
                    const features = card.querySelectorAll('[data-pricing-element="feature"]');
                    const cta = card.querySelector('[data-pricing-element="cta"]');

                    const tlCard = gsap.timeline();

                    tlCard.to([title, price, desc], {
                        y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out'
                    });

                    if (features.length > 0) {
                        tlCard.to(features, {
                            y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out'
                        }, '-=0.1');
                    }

                    tlCard.to(cta, {
                        y: 0, scale: 1, opacity: 1, duration: 0.4, ease: card === proCard ? 'back.out(1.5)' : 'back.out(1.2)'
                    }, '-=0.1');

                    // trigger after cards are settling
                    tlPricing.add(tlCard, 0.6 + (i * 0.14));
                });

                // Light Sweep on Pro Card
                if (proSweepContainer && proSweepInner) {
                    tlPricing
                        .to(proSweepContainer, { opacity: 1, duration: 0.01 }, 1.2)
                        .to(proSweepInner, {
                            xPercent: 200,
                            duration: 0.8,
                            ease: 'power1.inOut'
                        }, 1.2)
                        .to(proSweepContainer, { opacity: 0, duration: 0.3 }, 2.0);
                }
            }

            // === 8. FINAL CTA ===
            const ctaHeading = document.querySelector('[data-animation="cta-heading"]');
            const ctaSubtitle = document.querySelector('[data-animation="cta-subtitle"]');
            const ctaActions = document.querySelector('[data-animation="cta-actions"]');

            if (ctaHeading && ctaSubtitle && ctaActions) {
                gsap.set(ctaHeading, { y: 20, opacity: 0 });
                gsap.set(ctaSubtitle, { opacity: 0 });
                gsap.set(ctaActions, { scale: 0.95, opacity: 0 });

                const tlCTA = gsap.timeline({
                    scrollTrigger: {
                        trigger: ctaHeading,
                        start: 'top 85%',
                    }
                });

                tlCTA
                    .to(ctaHeading, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
                    .to(ctaSubtitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
                    .to(ctaActions, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.2');
            }

            // === 9. NAVBAR SCROLL STATE ===
            if (navbar) {
                ScrollTrigger.create({
                    start: 'top -50',
                    end: 99999,
                    // Since it's sticky + tailwind transition-all, we can just apply a data-attribute or class.
                    toggleClass: { targets: navbar, className: 'scrolled-nav' },
                });
            }
        });

    }, { scope: scopeRef });
}
