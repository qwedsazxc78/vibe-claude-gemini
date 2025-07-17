'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, XCircle } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

export default function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(currentQuery);

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
    <div className="relative flex items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="搜尋待辦事項..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9 pr-9"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearSearch}
          className="absolute right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}