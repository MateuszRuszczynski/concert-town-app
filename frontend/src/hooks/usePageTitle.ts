import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Concert Town`;

    return () => {
      document.title = 'Concert Town';
    };
  }, [title]);
}
