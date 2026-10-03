import type { SVGProps } from 'react'

const S = (p: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p} />
)

export const BagIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></S>)
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M12 5v14M5 12h14" /></S>)
export const MinusIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M5 12h14" /></S>)
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>)
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>)
export const BackIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></S>)
export const TrashIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></S>)
export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>)
export const PinIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.800 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></S>)
export const MotoIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M9 17h6l-2-7h-3M13 10h4l2 4M4 10h5" /></S>)
export const StoreIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M4 10v10h16V10M3 10l2-6h14l2 6a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" /></S>)
export const CardIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></S>)
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="m5 12 5 5 9-10" /></S>)
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><path d="M4 8h16M4 16h16" /></S>)
export const FlameIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.6 2c.5 3.200-1.100 4.700-2.600 6.300C8.400 10 7 11.700 7 14.400A5.300 5.300 0 0 0 12.300 20c3 0 5.200-2.300 5.200-5.300 0-2-.9-3.400-1.800-4.700-.5 1.300-1.200 2-2 2.300.5-3.100-.2-7.300-1.100-10.300Z" />
  </svg>
)
export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (<S {...p}><rect x="3.500" y="3.500" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.200" cy="6.800" r="1" fill="currentColor" stroke="none" /></S>)
export const WhatsappIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2Zm0 1.800a8.200 8.200 0 1 1-4.300 15.200l-.3-.2-2.900.8.800-2.800-.2-.3A8.200 8.200 0 0 1 12 3.800Zm-3.300 4c-.2 0-.5 0-.7.300-.3.300-1 1-1 2.300s1 2.700 1.100 2.900c.2.200 2 3.100 4.900 4.300 2.400 1 2.900.8 3.400.7.500 0 1.700-.7 1.900-1.300.2-.700.2-1.200.200-1.300-.100-.200-.300-.200-.600-.400l-1.900-.900c-.300-.100-.500-.100-.700.200l-.8 1c-.100.200-.300.200-.600.100-.300-.200-1.200-.500-2.200-1.400-.800-.700-1.400-1.600-1.500-1.900-.200-.300 0-.400.100-.600l.400-.500.300-.500c.100-.200 0-.400 0-.500l-.9-2c-.200-.500-.400-.500-.600-.500h-.800Z" />
  </svg>
)
