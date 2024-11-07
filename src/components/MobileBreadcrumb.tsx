'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function MobileBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter((path) => path);

  if (paths.length < 2) return;

  return (
    <Breadcrumb className='fixed top-0 dark px-6 py-2 z-40 lg:hidden'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/hub'>Hub</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {paths.map((path, i) => {
          if (i !== paths.length - 1) {
            return (
              <Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={path === 'notes' ? '/hub' : `/${path}`}
                      className='capitalize'
                    >
                      {path}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          } else {
            return (
              <BreadcrumbPage key={path}>
                <BreadcrumbLink asChild>
                  <Link href={`/${path}`}>Note</Link>
                </BreadcrumbLink>
              </BreadcrumbPage>
            );
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
