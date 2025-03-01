import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

export function MobileFilterDialog({
  selectedYear,
  setSelectedYear,
  selectedFaculty,
  setSelectedFaculty,
  faculties,
}: {
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  selectedFaculty: string;
  setSelectedFaculty: (faculty: string) => void;
  faculties: string[];
  clearFilters: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="ml-2">
            Filters
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4 item-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-gray-500 text-white px-4 py-2 rounded outline-black text-sm flex items-center justify-between">
                {selectedYear ? `Year ${selectedYear}` : "All Years"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-700 text-white w-[calc(90vw-2rem)] sm:w-[425px]">
                <DropdownMenuItem onClick={() => setSelectedYear(null)}>
                  All Years
                </DropdownMenuItem>
                {[1, 2, 3, 4].map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    Year {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-gray-500 text-white px-4 py-2 rounded outline-black text-sm flex items-center justify-between">
                {selectedFaculty}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-700 text-white w-[calc(90vw-2rem)] sm:w-[425px]">
                <DropdownMenuItem onClick={() => setSelectedFaculty("All Faculties")}>
                  All Faculties
                </DropdownMenuItem>
                {faculties.map((fac) => (
                  <DropdownMenuItem
                    key={fac}
                    onClick={() => setSelectedFaculty(fac)}
                  >
                    {fac}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-col items-center gap-2">
            <Button
              variant="default"
              onClick={() => setIsOpen(false)}
              className='w-auto px-12'
            >
              Apply Filters
            </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}