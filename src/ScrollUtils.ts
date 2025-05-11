import { useCallback, useEffect, useRef, useState } from "react";

// These are random values I picked that felt good
const MAX_SPEED = 200;
const ACCELERATION = 1.6;

/**
 * Smooth scrolling implementation
 *
 * (A better beizer curve would probably have better experience,
 * but my little brain can't handle it)
 */
export const useScroll = (
    getter: () => number,
    setter: (scroll: number) => void,
) => {
    const scrollStartTime = useRef(0);
    const scrollTarget = useRef(0);
    const scrollSpeed = useRef(0); // unsigned
    const isScrolling = useRef(false);

    const scrollTo = (target: number) => {
        scrollTarget.current = target;
        scrollStartTime.current = performance.now();
        if (isScrolling.current) {
            return;
        }
        isScrolling.current = true;
        // to ensure oscilation does not happen to cause high CPU usage,
        // we hard cap the scrolling time to 2 seconds
        const doScroll = () => {
            const elapsed = performance.now() - scrollStartTime.current;
            if (elapsed > 2000) {
                console.warn(
                    `[shared-controls] scrolling took too long! (${elapsed}ms)`,
                );
                setter(scrollTarget.current);
                scrollSpeed.current = 0;
                isScrolling.current = false;
                return;
            }
            const current = getter();
            const currentTarget = scrollTarget.current;
            let next = current;
            const slowDownThreshold =
                (scrollSpeed.current * scrollSpeed.current) / ACCELERATION / 2;
            if (Math.abs(currentTarget - current) <= slowDownThreshold) {
                // start slowing down
                scrollSpeed.current = Math.max(
                    ACCELERATION,
                    scrollSpeed.current - ACCELERATION,
                );
            } else if (scrollSpeed.current < MAX_SPEED) {
                scrollSpeed.current = Math.min(
                    MAX_SPEED,
                    scrollSpeed.current + ACCELERATION,
                );
            }
            if (currentTarget > current) {
                next = Math.min(currentTarget, current + scrollSpeed.current);
            } else {
                next = Math.max(currentTarget, current - scrollSpeed.current);
            }
            if (Math.abs(currentTarget - next) <= ACCELERATION) {
                // near target, stop
                next = currentTarget;
                scrollSpeed.current = 0;
                isScrolling.current = false;
                setter(next);
                return;
            }
            setter(next);
            // continue scrolling
            requestAnimationFrame(doScroll);
        };
        doScroll();
    };
    const scrollToMemo = useCallback(scrollTo, [getter, setter]);

    return { scrollTarget, isScrolling, scrollTo: scrollToMemo };
};

/**
 * Make it so that by default, mouse wheel scrolls horizontally,
 * and Shift + mouse wheel scrolls vertically
 *
 * ```example
 * const { ref } = useSwappedWheelScrollDirection();
 *
 * return (<div ref={ref}> ... </div>);
 * ```
 */
export const useSwappedWheelScrollDirection = () => {
    // perf L - we have to preventDefault in the handler,
    // so the wheel event needs to be non-passive
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const getterH = useCallback(() => {
        return elementRef?.scrollLeft || 0;
    }, [elementRef]);
    const setterH = useCallback(
        (scroll: number) => {
            if (!elementRef) {
                return;
            }
            elementRef.scrollLeft = scroll;
        },
        [elementRef],
    );
    const getterV = useCallback(() => {
        return elementRef?.scrollTop || 0;
    }, [elementRef]);
    const setterV = useCallback(
        (scroll: number) => {
            if (!elementRef) {
                return;
            }
            elementRef.scrollTop = scroll;
        },
        [elementRef],
    );

    const {
        scrollTarget: scrollTargetH,
        isScrolling: isScrollingH,
        scrollTo: scrollToH,
    } = useScroll(getterH, setterH);
    const {
        scrollTarget: scrollTargetV,
        isScrolling: isScrollingV,
        scrollTo: scrollToV,
    } = useScroll(getterV, setterV);
    const handler = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            if (!e.deltaY || !elementRef) {
                return;
            }
            const vertical = e.shiftKey;
            const max = vertical
                ? elementRef.scrollHeight - elementRef.clientHeight
                : elementRef.scrollWidth - elementRef.clientWidth;
            if (max <= 0) {
                return;
            }
            let current;
            if (vertical) {
                current = isScrollingV.current
                    ? scrollTargetV.current
                    : elementRef.scrollTop;
            } else {
                current = isScrollingH.current
                    ? scrollTargetH.current
                    : elementRef.scrollLeft;
            }
            const target = Math.max(Math.min(current + e.deltaY, max), 0);
            (vertical ? scrollToV : scrollToH)(target);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [elementRef],
    );

    useEffect(() => {
        if (!elementRef) {
            return;
        }
        const controller = new AbortController();
        elementRef.addEventListener("wheel", handler, {
            signal: controller.signal,
            passive: false,
        });
        return () => {
            controller.abort();
        };
        // handler depends on elementRef so just that is enough
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef]);

    return { ref: setElementRef, scrollToH, scrollToV };
};
