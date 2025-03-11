import { useRef, useEffect } from "react";

interface UseBlockContentProps {
  initialContent: string;
  onUpdate: (id: string, content: string) => void;
  id: string;
}

export const useBlockContent = ({
  initialContent,
  onUpdate,
  id,
}: UseBlockContentProps) => {
  const contentRef = useRef(initialContent);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && contentRef.current === "") {
      textRef.current.textContent = initialContent;
      contentRef.current = initialContent;
    }
  }, [initialContent]);

  const handleInput = () => {
    const newContent = textRef.current?.textContent || "";
    if (newContent !== contentRef.current) {
      contentRef.current = newContent;
      onUpdate(id, newContent);
    }
  };

  const setContent = (content: string) => {
    if (textRef.current) {
      textRef.current.textContent = content;
      contentRef.current = content;
    }
  };

  return {
    textRef,
    contentRef,
    handleInput,
    setContent,
  };
};
