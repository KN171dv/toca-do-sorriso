import type { Product, ProductImage } from '@/types'
import { ADDONS_BASIC, ADDONS_FULL } from './addons'

/**
 * Cardápio real — nomes, descrições e preços copiados do InstaDelivery
 * (auditoria de 02/10/2026). Apenas espaçamento/pontuação foram normalizados.
 * Produtos sem foto no site original ficam sem `image` (placeholder na UI).
 */
const CDN = 'https://instadelivery-public.nyc3.cdn.digitaloceanspaces.com/'
const S3 = 'https://instadelivery-public.nyc3.digitaloceanspaces.com/'

const img = (slug: string, remote: string, alt: string): ProductImage => ({
  src: `/images/products/${slug}.webp`,
  srcSmall: `/images/products/${slug}-sm.webp`,
  remote,
  alt,
})

export const products: Product[] = [
  // ── Hambúrgueres ─────────────────────────────────────────────
  {
    id: 'burguer-bacon', sourceId: 3537325, categoryId: 'hamburgueres', order: 1, active: true,
    name: 'Burguer Bacon',
    description: 'Pão brioche tostado na manteiga, 100g de carne, queijo cheddar, bacon e maionese temperada.',
    price: 24.99, badges: [], addonIds: ADDONS_BASIC,
    image: img('burguer-bacon', CDN + 'itens/177710156769ec6aff51ff9.jpeg', 'Burguer Bacon com cheddar, bacon e maionese temperada'),
  },
  {
    id: 'duplo-bacon', sourceId: 3537336, categoryId: 'hamburgueres', order: 2, active: true,
    name: 'Duplo Bacon',
    description: 'Pão brioche tostado na manteiga, 2 carnes de 100g, queijo cheddar, bacon e maionese temperada.',
    price: 29.99, badges: ['mais-pedido'], addonIds: ADDONS_FULL,
    image: img('duplo-bacon', CDN + 'itens/177249316469a6196cdf050.jpeg', 'Duplo Bacon com duas carnes, cheddar derretido e bacon'),
  },
  {
    id: 'salada-burguer', sourceId: 3537335, categoryId: 'hamburgueres', order: 3, active: true,
    name: 'Salada Burguer',
    description: 'Pão brioche tostado na manteiga, 100g de carne, queijo cheddar, alface, tomate, cebola roxa e maionese temperada.',
    price: 26.99, badges: [], addonIds: ADDONS_BASIC,
    image: img('salada-burguer', CDN + 'itens/177635785469e111de74b7b.jpeg', 'Salada Burguer com alface, tomate e cebola roxa'),
  },
  {
    id: 'brasileirinho-burguer', sourceId: 5840917, categoryId: 'hamburgueres', order: 4, active: true,
    name: 'Brasileirinho Burguer',
    description: 'Pão brioche, blend de carne 100g, queijo coalho, geleia de pimenta e maionese.',
    price: 35.99, badges: ['novidade'], addonIds: [],
  },
  {
    id: 'melt-burguer', sourceId: 5126444, categoryId: 'hamburgueres', order: 5, active: true,
    name: 'Melt Burguer',
    description: 'Pão brioche tostado na manteiga, 1 carne de 100g, molho cheddar, bacon e cebola caramelizada.',
    price: 29.99, badges: [], addonIds: ADDONS_FULL,
    image: img('melt-burguer', CDN + 'itens/177635789369e1120577297.jpeg', 'Melt Burguer com molho cheddar e cebola caramelizada'),
  },
  {
    id: 'big-sorriso', sourceId: 5192033, categoryId: 'hamburgueres', order: 6, active: true,
    name: 'Big Sorriso',
    description: 'Pão brioche tostado na manteiga, 3 carnes de 100g, queijo cheddar, bacon e maionese temperada.',
    price: 39.99, badges: [], addonIds: ADDONS_FULL,
    image: img('big-sorriso', CDN + 'itens/177059359069891d3609823.jpeg', 'Big Sorriso com três carnes, cheddar e bacon'),
  },
  {
    id: 'churras-burguer', sourceId: 3537337, categoryId: 'hamburgueres', order: 7, active: true,
    name: 'Churras Burguer',
    description: 'Pão brioche tostado na manteiga, 100g de carne, toscana, queijo cheddar, vinagrete e maionese temperada.',
    price: 29.99, badges: [], addonIds: ADDONS_FULL,
    image: img('churras-burguer', CDN + 'itens/177635800569e1127583fd3.jpeg', 'Churras Burguer com toscana e vinagrete'),
  },
  {
    id: 'tudao', sourceId: 3687598, categoryId: 'hamburgueres', order: 8, active: true,
    name: 'Tudão',
    description: 'Pão brioche tostado na manteiga, 1 carne de 100g, queijo cheddar, bacon, ovo, salada e maionese temperada.',
    price: 37.99, badges: ['mais-pedido'], addonIds: ADDONS_FULL,
    image: img('tudao', CDN + 'itens/177249370369a61b87c931d.jpeg', 'Tudão com ovo, bacon, salada e cheddar'),
  },

  // ── Combos ───────────────────────────────────────────────────
  {
    id: 'combo-casal-2', sourceId: 3537341, categoryId: 'combos', order: 1, active: true,
    name: 'Combo Casal 2',
    description: '2 Duplo Bacon + 1 Batata M + Porção de Nugget Supreme.',
    price: 69.99, badges: ['mais-vendido'], addonIds: ADDONS_FULL,
    image: img('combo-casal-2', CDN + 'itens/177635811869e112e6a7dd1.jpeg', 'Combo Casal 2 com dois hambúrgueres, batata e nuggets'),
  },
  {
    id: 'combo-casal-1', sourceId: 3537340, categoryId: 'combos', order: 2, active: true,
    name: 'Combo Casal 1',
    description: '2 Burguer Bacon + 1 Batata M + Porção de Nugget Supreme.',
    price: 59.99, badges: [], addonIds: ADDONS_FULL,
    image: img('combo-casal-1', CDN + 'itens/177635814269e112fe2017f.jpeg', 'Combo Casal 1 com dois hambúrgueres, batata e nuggets'),
  },
  {
    id: 'combo-individual-2', sourceId: 3537339, categoryId: 'combos', order: 3, active: true,
    name: 'Combo Individual 2 + latinha',
    description: 'Duplo Bacon + Batata P + Refri lata.',
    price: 44.99, badges: [], addonIds: ADDONS_FULL,
    image: img('combo-individual-2', CDN + 'itens/177635844969e1143105fa2.jpeg', 'Combo individual com hambúrguer, batata e refrigerante em lata'),
  },
  {
    id: 'combo-individual-1', sourceId: 3537338, categoryId: 'combos', order: 4, active: true,
    name: 'Combo Individual 1 + latinha',
    description: 'Burguer Bacon + Batata P + Refri lata.',
    price: 39.99, compareAtPrice: 49.99, badges: [], addonIds: ADDONS_FULL,
    image: img('combo-individual-1', CDN + 'itens/177635850969e1146d7a90a.jpeg', 'Combo individual com hambúrguer, batata e refrigerante em lata'),
  },

  // ── Prato feito ──────────────────────────────────────────────
  {
    id: 'pf-carne-frango', sourceId: 4158098, categoryId: 'prato-feito', order: 1, active: true,
    name: 'Prato feito com batata frita, carne e frango',
    description: 'Arroz, farofa, batata frita e molho acompanham.',
    price: 25, badges: ['novidade'], addonIds: [],
  },
  {
    id: 'pf-carne-linguica', sourceId: 5118321, categoryId: 'prato-feito', order: 2, active: true,
    name: 'Prato feito com batata frita, carne e linguiça',
    description: 'Arroz, farofa, batata frita e molho acompanham.',
    price: 25, badges: ['novidade'], addonIds: [],
  },

  // ── Porções ──────────────────────────────────────────────────
  { id: 'fritas-p', sourceId: 3537306, categoryId: 'porcoes', order: 1, active: true, name: 'Fritas P', description: '', price: 9.99, badges: [], addonIds: [],
    image: img('fritas', S3 + 'images/O2Mk7kNeIZjeVGI7hvgirnzJUinNG0njA7fCNvQV.jpg', 'Porção de batata frita') },
  { id: 'fritas-m', sourceId: 3537307, categoryId: 'porcoes', order: 2, active: true, name: 'Fritas M', description: '', price: 14.99, badges: [], addonIds: [],
    image: img('fritas', S3 + 'images/O2Mk7kNeIZjeVGI7hvgirnzJUinNG0njA7fCNvQV.jpg', 'Porção de batata frita') },
  { id: 'fritas-g', sourceId: 3537308, categoryId: 'porcoes', order: 3, active: true, name: 'Fritas G', description: '', price: 24.99, badges: [], addonIds: [],
    image: img('fritas-g', CDN + 'itens/173987858267b470b695b99.jpeg', 'Porção grande de batata frita') },
  { id: 'fritas-cheddar-bacon-p', sourceId: 3682759, categoryId: 'porcoes', order: 4, active: true, name: 'Fritas com cheddar Polenghi e bacon P', description: '', price: 11.99, badges: [], addonIds: [],
    image: img('fritas-cheddar-bacon', S3 + 'images/OWMpnSsPfyS2o7CZpXYlDiHjbpHLUBrzoYNxyumJ.jpg', 'Batata frita com cheddar e bacon') },
  { id: 'fritas-cheddar-bacon-m', sourceId: 3682761, categoryId: 'porcoes', order: 5, active: true, name: 'Fritas com cheddar Polenghi e bacon M', description: '', price: 24.99, badges: [], addonIds: [],
    image: img('fritas-cheddar-bacon', S3 + 'images/OWMpnSsPfyS2o7CZpXYlDiHjbpHLUBrzoYNxyumJ.jpg', 'Batata frita com cheddar e bacon') },
  { id: 'fritas-cheddar-bacon-g', sourceId: 3682762, categoryId: 'porcoes', order: 6, active: true, name: 'Fritas com cheddar Polenghi e bacon G', description: '', price: 33.99, badges: [], addonIds: [],
    image: img('fritas-cheddar-bacon', S3 + 'images/OWMpnSsPfyS2o7CZpXYlDiHjbpHLUBrzoYNxyumJ.jpg', 'Batata frita com cheddar e bacon') },
  { id: 'nugget-supreme', sourceId: 3537343, categoryId: 'porcoes', order: 7, active: true, name: 'Porção Nugget Supreme com molho verde', description: '', price: 15.99, badges: [], addonIds: [],
    image: img('nugget-supreme', CDN + 'itens/174009113967b7af0391d67.jpeg', 'Porção de nuggets com molho verde') },
  { id: 'piscininha-cheddar', sourceId: 3537344, categoryId: 'porcoes', order: 8, active: true, name: 'Piscininha de Cheddar Polenghi', description: '', price: 8.99, badges: [], addonIds: [],
    image: img('piscininha-cheddar', CDN + 'itens/173987872267b471428546e.jpeg', 'Piscininha de cheddar derretido') },
  { id: 'maionese-temperada', sourceId: 4123851, categoryId: 'porcoes', order: 9, active: true, name: 'Maionese temperada', description: '', price: 1.99, badges: [], addonIds: [],
    image: img('maionese-temperada', CDN + 'itens/17643595916929fda7bc443.jpeg', 'Pote de maionese temperada') },

  // ── Bebidas ──────────────────────────────────────────────────
  { id: 'coca-lata', sourceId: 3928607, categoryId: 'bebidas', order: 1, active: true, name: 'Coca-Cola Lata', description: '', price: 6, badges: [], addonIds: [],
    image: img('coca-lata', CDN + 'itens/17481573366832c39810fce.jpeg', 'Coca-Cola lata') },
  { id: 'coca-lata-350', sourceId: 3537314, categoryId: 'bebidas', order: 2, active: true, name: 'Coca-Cola Lata 350ml', description: '', price: 6, badges: [], addonIds: [],
    image: img('coca-lata-350', CDN + 'itens/173987893767b4721910727.jpeg', 'Coca-Cola lata 350ml') },
  { id: 'coca-zero-lata', sourceId: 3542543, categoryId: 'bebidas', order: 3, active: true, name: 'Coca-Cola Zero Lata', description: '', price: 6, badges: [], addonIds: [],
    image: img('coca-zero-lata', CDN + 'itens/173996879767b5d11dcaafb.jpeg', 'Coca-Cola Zero lata') },
  { id: 'fanta-lata', sourceId: 3542542, categoryId: 'bebidas', order: 4, active: true, name: 'Fanta Lata', description: '', price: 6, badges: [], addonIds: [],
    image: img('fanta-lata', S3 + 'images/uyzOaHuaE6pxBkUHGoxzwhFV0kxpYlwKLQe2nKOE.jpg', 'Fanta lata') },
  { id: 'sprite-lata', sourceId: 3542544, categoryId: 'bebidas', order: 5, active: true, name: 'Sprite Lata', description: '', price: 6, badges: [], addonIds: [],
    image: img('sprite-lata', CDN + 'itens/173996878267b5d10e9868d.jpeg', 'Sprite lata') },
  { id: 'pepsi', sourceId: 4868520, categoryId: 'bebidas', order: 6, active: true, name: 'Pepsi', description: '', price: 6, badges: [], addonIds: [],
    image: img('pepsi', CDN + 'itens/176393732069238c28ee503.jpeg', 'Pepsi lata') },
  { id: 'agua-tonica', sourceId: 3537311, categoryId: 'bebidas', order: 7, active: true, name: 'Água Tônica', description: '', price: 6, badges: [], addonIds: [],
    image: img('agua-tonica', S3 + 'images/qedttIJpPWsmDUnVOzEMEYHTIVhNvbnG7GWR0Lyy.jpg', 'Água tônica lata') },
  { id: 'del-valle', sourceId: 3537315, categoryId: 'bebidas', order: 8, active: true, name: 'Del Valle Lata 290ml', description: 'Uva ou pêssego.', price: 7, badges: [], addonIds: [],
    image: img('del-valle', CDN + 'itens/173987894567b47221cf24d.jpeg', 'Del Valle lata') },
  { id: 'guaracamp', sourceId: 3537312, categoryId: 'bebidas', order: 9, active: true, name: 'Guaracamp', description: 'Sabores.', price: 2.5, badges: [], addonIds: [],
    image: img('guaracamp', CDN + 'itens/173987890867b471fc96b91.jpeg', 'Copo de Guaracamp') },
  { id: 'agua-com-gas', sourceId: 3537309, categoryId: 'bebidas', order: 10, active: true, name: 'Água c/ Gás', description: '', price: 3, badges: [], addonIds: [],
    image: img('agua-com-gas', S3 + 'images/mWQIoQgS2UOakqbvPqAIA0dpgO2hk5WvUalgiIjH.jpg', 'Água mineral com gás') },
  { id: 'coca-1-5l', sourceId: 4003095, categoryId: 'bebidas', order: 11, active: true, name: 'Coca-Cola 1,5L', description: '', price: 11.99, badges: [], addonIds: [],
    image: img('coca-1-5l', CDN + 'itens/174957339868485f1651691.jpeg', 'Coca-Cola 1,5 litro') },
  { id: 'coca-zero-1-5l', sourceId: 4077620, categoryId: 'bebidas', order: 12, active: true, name: 'Coca-Cola Zero 1,5L', description: '', price: 11.99, badges: [], addonIds: [],
    image: img('coca-zero-1-5l', CDN + 'itens/1750887039685c6a7fd364f.jpeg', 'Coca-Cola Zero 1,5 litro') },
  { id: 'coca-2l', sourceId: 3542537, categoryId: 'bebidas', order: 13, active: true, name: 'Coca-Cola 2L', description: '', price: 15, badges: [], addonIds: [],
    image: img('coca-2l', S3 + 'images/6burz8IEIFPiUPNJkA4HEPLLg9ThgCfDY7Hftldj.jpg', 'Coca-Cola 2 litros') },
]
