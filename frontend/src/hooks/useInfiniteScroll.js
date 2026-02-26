import { useEffect, useRef } from "react";

export default function useInfiniteScroll(callback, hasMore) {
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) callback();
            },
            { threshold: 1.0 },
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [callback, hasMore]);

    return sentinelRef;
}
