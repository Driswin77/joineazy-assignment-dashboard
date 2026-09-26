import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function CourseCombobox({ id, value, onChange, options, placeholder, invalid }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value ?? '');
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value ?? '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options;
    return options.filter((option) => option.toLowerCase().includes(search));
  }, [options, query]);

  const exactMatch = options.some((option) => option.toLowerCase() === query.trim().toLowerCase());
  const showCreateOption = query.trim() && !exactMatch;

  const commit = (next) => {
    setQuery(next);
    onChange(next);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={wrapRef}>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="input pr-9"
          aria-invalid={invalid}
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setOpen((current) => !current);
            inputRef.current?.focus();
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label={open ? 'Close course options' : 'Open course options'}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-pop animate-fade-in"
        >
          {filtered.length === 0 && !showCreateOption ? (
            <p className="px-3 py-2.5 text-sm text-slate-500">No matching course.</p>
          ) : (
            <>
              {filtered.map((option) => {
                const selected = option.toLowerCase() === query.trim().toLowerCase();

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commit(option)}
                    className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selected
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}

              {showCreateOption ? (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commit(query.trim())}
                  className="mt-1 flex w-full items-center gap-2 rounded-md border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <span className="text-xs text-slate-400">Use</span>
                  <span className="truncate font-medium">"{query.trim()}"</span>
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}