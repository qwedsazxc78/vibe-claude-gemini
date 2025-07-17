'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, XCircle } from 'lucide-react';
import { useState, useEffect, forwardRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ onSearch, currentQuery }, ref) => {
  const [searchQuery, setSearchQuery] = useState(currentQuery);

  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="space-y-2">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="text"
          placeholder="搜尋待辦事項..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9 pr-20"
          aria-label="搜尋待辦事項"
        />
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
          <kbd className="hidden sm:inline-block px-1 py-0.5 bg-muted border border-border rounded text-xs">
            Ctrl + F
          </kbd>
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
            title="清空搜尋 (Esc)"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          💡 快捷鍵：
          <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Ctrl + F</kbd>
          聚焦搜尋框，
          <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Esc</kbd>
          清空搜尋
        </span>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;