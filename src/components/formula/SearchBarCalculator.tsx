import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Users } from "lucide-react";

interface FormulaItem {
  title: string;
  description: string;
  Id: string;
}

interface SearchBarProps {
  data: FormulaItem[];
  highlightElementById: (id: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ data, highlightElementById }) => {
  const [input, setInput] = useState<string>("");
  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const filteredResults = data.filter((item) =>
    item.title.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (Id: string) => {
    const element = document.getElementById(Id);
    element?.scrollIntoView({
      behavior: "smooth",
    });

    highlightElementById(Id);
  };

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg overflow-visible"
    >
      <CommandInput
        onValueChange={(text) => setInput(text)}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Busca Tus Metodos Favoritos..."
        isLoading={false}
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {filteredResults.length < 1 && (
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          )}

          {filteredResults.length > 0 && (
            <CommandGroup heading="Modulos">
              {filteredResults.map((result) => (
                <CommandItem
                  key={result.Id}
                  value={result.title}
                  onSelect={() => {
                    handleSelect(result.Id);
                  }}
                >
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
