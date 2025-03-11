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
      textRef.current.innerHTML = initialContent;
      contentRef.current = initialContent;
    }
  }, [initialContent]);

  const handleInput = () => {
    if (!textRef.current) return;
    const newContent = textRef.current.innerHTML;
    if (newContent !== contentRef.current) {
      contentRef.current = newContent;
      onUpdate(id, newContent);
    }
  };

  const setContent = (content: string) => {
    if (textRef.current) {
      textRef.current.innerHTML = content;
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
