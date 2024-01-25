import React, { useState, useEffect, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import RangeSlider from './RangeSlider';

import {
  getFacetedUniqueValues,
} from '@tanstack/react-table'

type Person = {
  firstName: string;
  lastName: string;
  salary: number,
  address: string;
  city: string;
  state: string;
};

const data: Person[] = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    salary: 100000,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    firstName: 'Jane',
    lastName: 'Coe',
    salary: 80000,
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    firstName: 'Joe',
    lastName: 'Doe',
    salary: 120000,
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    firstName: 'Kevin',
    lastName: 'Vandy',
    salary: 150000,
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    firstName: 'Joshua',
    lastName: 'Rolluffs',
    salary: 75000,
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const Table = () => {
  const [showFilters, setShowFilters] = useState(true);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        filterVariant: 'autocomplete',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        filterVariant: 'autocomplete',
        size: 150,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        aggregationFn: 'min',
        muiFilterSliderProps: {
          marks: true,
          max: 200_000, //custom max (as opposed to faceted max)
          min: 30_000, //custom min (as opposed to faceted min)
          step: 10_000,
          valueLabelFormat: (value) =>
            value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        filterVariant: 'autocomplete',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'autocomplete',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        filterVariant: 'autocomplete',
        size: 150,
        enableSorting: true,
      },
    ],
   []
  );

  type MyObject = {
    id: string;
    value: string | Number[];
  };

  type MySort = {
    id: string;
    desc: boolean;
  };

  const [filterValues, setFilterValues] = useState<MyObject[]>([]);
  const [sorting, setSorting] = useState<MySort[]>([]);
  const [facetedValues, setFacetedValues] = useState<string[]>();
  const [columnVisibility, setcolumnVisibility] = useState<Record<string, boolean>>({});

  const fetchFacetedValues = (columnId: any) => {
    const uniqueValues = Array.from(table.getColumn(columnId).getFacetedUniqueValues().keys());
    setFacetedValues(uniqueValues)
  };

  const [initialMinMaxValues, setInitialMinMaxValues] = useState<number[]>([]);

    useEffect(() => {
        const uniqueValues = Array.from(
        table.getColumn("salary").getFacetedUniqueValues().keys()
        );
        const minSalary = Math.min(...uniqueValues);
        const maxSalary = Math.max(...uniqueValues);
        setInitialMinMaxValues([minSalary, maxSalary]);
        console.log(initialMinMaxValues[0]);
    }, []);
        
    const handleFilterChange = (e:any, id:any) => {
            
    const updatedValues = [...filterValues];

    const existingValueIndex = updatedValues.findIndex(
        (value) => value.id === id
    );

    if(existingValueIndex !== -1) {
        if(id === "salary") {
            updatedValues[existingValueIndex].value = e;
        } else {
            updatedValues[existingValueIndex].value = e.target.value;
        }
    } else {
        if(id === "salary") {
            updatedValues.push({ id, value: e });
        } else {
            updatedValues.push({ id, value: e.target.value });
        }
    }

    setFilterValues(updatedValues);
  };

  const [currentButton, setCurrentButton] = useState(0);

  const handleSortClick = (id:any,value:boolean) => {
    const updatedSortValues = [...sorting];

    const existingValueIndex = updatedSortValues.findIndex(
        (value) => value.id === id
    );

    setCurrentButton(existingValueIndex);

    if (existingValueIndex !== -1) {
        updatedSortValues[existingValueIndex].desc = value;
    }
    else {
        updatedSortValues.push({ id, value });
    }

    setSorting(updatedSortValues);
  };

  const handleColumnClick = (id: string, value: boolean) => {
    setcolumnVisibility((prev) => {
        if (!(id in prev)) {
        return {
            ...prev,
            [id]: !value,
        };
        }
        return {
        ...prev,
        [id]: value,
        };
    });
  };

  const initialColumnOrder = columns.map((column) => column.accessorKey);

  const [columnOrder, setColumnOrder] = useState<Array<string>>(initialColumnOrder);

  const handleColumnOrderClick = (id: string, direction: string) => {
    const currentIndex = columnOrder.indexOf(id);

    if (currentIndex !== -1) {
        const newPosition =
        direction === "left" ? Math.max(currentIndex - 1, 0) : currentIndex + 1;

        const newOrder = [...columnOrder];
        newOrder.splice(currentIndex, 1); 
        newOrder.splice(newPosition, 0, id);

        setColumnOrder(newOrder);
    }
 };
  
  const table = useMaterialReactTable({
      columns,
      data,
      enableColumnActions: false,
      onShowColumnFiltersChange: () => {
          setShowFilters((prevShowFilters) => !prevShowFilters);
        },
      onSortingChange: setSorting,
      onColumnVisibilityChange: setcolumnVisibility,
      onColumnOrderChange: setColumnOrder,
      getFacetedUniqueValues: getFacetedUniqueValues(),
      state: { columnFilters: filterValues, sorting, columnVisibility, columnOrder},
    });
    
  return (
    <div className="flex flex-col items-center">
      <MaterialReactTable table={table}/>
      {showFilters && initialMinMaxValues.length > 0 && (
        <div className="mt-4 p-4 border rounded shadow-md">
          {columns.map((column) => (
            <div key={column.accessorKey} className="mb-2 flex items-center">
            <span className="w-[90px] text-lg font-semibold mx-2">{column.header}</span>
            {column.accessorKey !== 'salary' && (
            <input
                className='w-[210px] border rounded p-2'
                type="text"
                key={column.id}
                placeholder={`Filter ${column.header}`}
                onChange={(e) => handleFilterChange(e, column.id)}
            />)
            }
            {column.accessorKey === 'salary' && initialMinMaxValues.length > 0 && (
                <div className='w-[397px] mx-5'>
                  <RangeSlider min={initialMinMaxValues[0]} max={initialMinMaxValues[1]} onChange={(e) => handleFilterChange(e, column.id)} />
                </div>
              )}
            {column.accessorKey !== 'salary' && (
            <div>
                  <select
                    className="w-[210px] border rounded mx-2 p-2 hover:cursor-pointer"
                    value={filterValues.find((f) => f.id === column.id)?.value || ''}
                    onChange={(e) => handleFilterChange(e, column.id)}
                    onClick={() => fetchFacetedValues(column.id)}
                  >
                    <option value="">Select...</option>
                    {facetedValues?.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
            </div>)}
            <button 
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={(e) => handleSortClick(column.id, !sorting[currentButton]?.desc)}
              >
                Sort
              </button>
            <button
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={(e) => handleColumnClick(column.id, !columnVisibility[column.id])
                }
              >
                View / Hide
              </button>
            <button
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={(e) => handleColumnOrderClick(column.id, "left")
                }
              >
                Left
              </button>
            <button
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={(e) => handleColumnOrderClick(column.id, "right")
                }
              >
                Right
              </button>
            </div>
          ))}
        </div>
        )}
    </div>
  );
};

export default Table;