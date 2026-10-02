# Auditoria do InstaDelivery

Fonte: https://instadelivery.com.br/tocadosorrisorj — coletado em 02/10/2026 (dados públicos da loja).

## Empresa
| Campo | Valor |
|---|---|
| Nome | Toca do Sorriso na brasa 🔥 |
| Tipo | Hambúrguer |
| Endereço | Rua Marcolino da Costa, Lt 28, Loja E — Mendanha, Rio de Janeiro/RJ |
| Referência | Próximo ao Bazar Paraty, ao lado da Heliar |
| WhatsApp | (21) 97031-6536 |
| Telefone | (21) 96515-3899 |
| Instagram | @toca_do_sorriso |
| Horário | Dom a Sex 19:00–23:59 · Sáb 19:20–23:59 |
| Pedido mínimo | R$ 20,00 |
| Tempo estimado | 45 min (entrega e retirada) |
| Modalidades | Entrega, retirada e consumo no local |
| Pagamento | Dinheiro · PIX (chave enviada após o pedido) · Débito e crédito na maquininha |
| Mensagem | "Seja bem vindo(a) a Toca do Sorriso na Brasa. Faça seu pedido abaixo!" |

## Cardápio (37 itens)
- **Hambúrguer (8):** Burguer Bacon 24,99 · Duplo Bacon 29,99 (destaque) · Salada Burguer 26,99 · Brasileirinho Burguer 35,99 (novidade, sem foto) · Melt Burguer 29,99 · Big Sorriso 39,99 · Churras Burguer 29,99 · Tudão 37,99 (destaque)
- **Combos (4):** Casal 2 69,99 (+ vendido) · Casal 1 59,99 · Individual 2 + latinha 44,99 · Individual 1 + latinha 39,99 (de 49,99)
- **Prato feito (2, sem foto):** carne e frango 25,00 · carne e linguiça 25,00
- **Porções (9):** Fritas P 9,99 / M 14,99 / G 24,99 · Fritas com cheddar Polenghi e bacon P 11,99 / M 24,99 / G 33,99 · Nugget Supreme com molho verde 15,99 · Piscininha de Cheddar Polenghi 8,99 · Maionese temperada 1,99
- **Bebidas (13):** latas 6,00 (Coca, Coca 350ml, Coca Zero, Fanta, Sprite, Pepsi, Água Tônica) · Del Valle 7,00 · Guaracamp 2,50 · Água c/ gás 3,00 · Coca 1,5L e Zero 1,5L 11,99 · Coca 2L 15,00
- **Categorias vazias:** Sobremesas, Sorvete carioca 250g (cadastradas como inativas)

## Adicionais (hambúrgueres e combos)
Carne extra 6,00 · Cebola caramelizada 4,00 · Ovo 4,00 · Salada 3,00 · Bacon 3,00 · Picles 2,00 · Cheddar Polenghi 3,50 · Mostarda com mel 1,99.
Burguer Bacon e Salada Burguer não oferecem "Salada"; Brasileirinho não tem adicionais.

## Entrega
29 bairros com taxa de R$ 4,00 a R$ 15,00 (lista completa em `src/data/delivery.ts`). Existe também uma tabela por km (até 8 km).

## Observações da auditoria
1. **Logo com erro de grafia**: o arquivo do logo diz "TOCA **DD** SORRISO". No cabeçalho o site usa a marca em texto; o selo original aparece só no rodapé. Vale refazer o logo.
2. **Taxa de entrega**: a loja tem duas tabelas (bairro e km). O site usa a de bairros — confirmar com o proprietário qual vale.
3. **Fotos**: as dos hambúrgueres e combos são reais e boas (500×500). Fritas, bebidas e adicionais usam fotos genéricas de produto; as dos adicionais não foram usadas.
4. **Combos Individual 1 e 2**: as fotos parecem trocadas entre si no cadastro original (a do "Individual 1" mostra duas carnes). Mantido como está na origem.
5. **Avaliação** (4,76) existe no sistema, mas a loja optou por não exibir — não foi usada.
6. Não encontrados: CEP, CNPJ, coordenadas, slogan oficial, chave PIX pública.
