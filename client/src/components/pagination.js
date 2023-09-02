import React from 'react';
import { ReactComponent as ChevronLeftDoubleIco } from '../assets/chevron-left-double.svg';
import { ReactComponent as ChevronLeftIco } from '../assets/chevron-left.svg';
import { ReactComponent as ChevronRightDoubleIco } from '../assets/chevron-right-double.svg';
import { ReactComponent as ChevronRightIco } from '../assets/chevron-right.svg';
import './pagination.css';


export default function Pagination(props) {
   const pages = Math.ceil(props.total / props.limit);
   const currentPage = props.skip / props.limit;

   const sizes = props.sizes || [10, 20, 50, 100];
   const PAGES_LEFT = 2;
   const PAGES_RIGHT = 3; // includes the current page
   const pageIds = [];

   const fromRecord = props.total > 0 ? props.skip + 1 : 0;
   const lastRecordIdx = props.skip + props.limit;
   const toRecord = lastRecordIdx < props.total ? lastRecordIdx : props.total;

   if (props.total > 0) {
      for (let i = currentPage - PAGES_LEFT; i < currentPage; i++) {
         if (i < 0) continue;
         pageIds.push(i);
      }
      
      pageIds.push(currentPage);
      for (let i = currentPage + 1; i < currentPage + PAGES_RIGHT; i++) {
         if (i >= pages) break;
         pageIds.push(i);
      }
   }

   const addMorePrevious = pageIds.length > 0 && pageIds[0] > 0;
   const addMoreNext = pageIds.length > 0 && pageIds[pageIds.length-1] < pages-1;

   const onChange = (args) => {
      const skip = args.skip !== undefined ? args.skip : props.skip;
      const limit = args.limit || props.limit;
      props.onChange({ skip, limit });
   };


   return (

      <div className='paging pg_flex_row'>
         <div className='sizes pg_flex_row'>
            <div>Lines per page</div>
            <select
               onChange={(el) => {
                  const limit = parseInt(el.target.value);
                  if (!Number.isInteger(limit)) return;
                  onChange({ limit });
               }}
               value={sizes.find((s) => s === props.limit) || sizes[1]}
            >
               {sizes.map((s) => {
                  return <option key={s}>{s}</option>;
               })}
            </select>
            <div>
               {fromRecord} - {toRecord} of {props.total}
            </div>
         </div>
         <div className='pages pg_flex_row'>
            <div>Page {props.total > 0 ? (currentPage + 1):0} of {pages} </div>
            <div className='pageBtnWrapper pg_flex_row'>
               <button type='button' disabled={currentPage <= 0} onClick={() => onChange({ skip: 0 })} className='pageBtn'>
                  <ChevronLeftDoubleIco />
               </button>
               <button type='button' disabled={currentPage <= 0} onClick={() => onChange({ skip: ((currentPage - 1) * props.limit) })} className='pageBtn'>
                  <ChevronLeftIco />
               </button>

               {addMorePrevious && <span>...</span>}
               
               {pageIds.map((number, idx) => (

                  <button key={idx} type='button' onClick={() => onChange({ skip: number * props.limit })} className={currentPage === number ? 'pageBtn active' : 'pageBtn'}>
                     {number + 1}
                  </button>
               ))}

               {addMoreNext && <span>...</span>}

               <button type='button' disabled={currentPage + 1 >= pages} onClick={() => onChange({ skip: ((currentPage + 1) * props.limit) })} className='pageBtn'>
                  <ChevronRightIco />
               </button>
               <button type='button' disabled={currentPage + 1 >= pages} onClick={() => onChange({ skip: ((pages - 1) * props.limit) })} className='pageBtn'>
                  <ChevronRightDoubleIco />
               </button>
            </div>
         </div>




      </div>
   );


}
