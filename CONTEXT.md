# Lukas Archery Works

The product-catalog website for Lukas Archery Works (LAW), a Slovak brand of handcrafted horseback-archery equipment. The site is inquiry-driven (no online checkout): it presents products and routes visitors to contact the maker via a contact form and an AI chatbot.

## Language

### Brand & domain

**Lukas Archery Works (LAW)**:
The brand. Use the full name in visitor-facing copy; "LAW" is acceptable as an internal/abbreviated reference only.

**Horseback Archery (HBA)**:
The sport the equipment is built for — shooting a bow from a moving horse. "HBA" is the accepted shorthand within the domain.
_Avoid_: mounted archery (different community term; not used by this brand).

**Eventing disciplines**:
The competition formats within horseback archery (e.g. track/lane events) that a quiver must suit. Used to express product fitness ("suitable for all HBA eventing disciplines").

### Products

Each product has one canonical name. Always capitalize the product name as a proper noun.

**WINGS**:
An arrow **nocking aid** — a small precision part that makes seating the arrow on the string secure and fast. The brand's only non-quiver product. Made from renewable bioplastic, tuned per arrow diameter.
_Avoid_: nock, nock adapter (those name the arrow part, not this aid).

**ARC**:
A **sideback quiver** of traditional beef-leather construction, 30- or 45-arrow variants. The product is named "ARC" — it is not a generic word for archery or a bow.
_Avoid_: using "arc" generically; it always refers to this quiver.

**HORIZON**:
A modern, highly modular quiver (single row, up to 31 arrows), positioned as the fastest quiver and the evolution of the legacy "Flying quiver".

### Equipment terms

**Nocking**:
The act of seating an arrow's rear end onto the bowstring. A **nocking aid** (WINGS) assists this.

**Quiver**:
The arrow-carrying container worn by the archer. **Sideback quiver** (ARC) is a quiver worn at the side/back; it is a kind of quiver, not a separate concept.

**Slavic technique** / **Thumb technique**:
The two arrow-drawing/release styles the products support. Stated per product as supported "nocking techniques". Treat as fixed domain terms, not descriptions.

**Flying quiver**:
A legacy/predecessor quiver design referenced for heritage. HORIZON is its successor. Not a current product.

## Flagged ambiguities

- **"ARC"** — must never be used in its everyday English sense (a curve) anywhere in product copy or chatbot grounding; it is exclusively the quiver's name.
- **"LAW"** — the brand abbreviation. Do not confuse with legal/"company rules" content even though the site also hosts legal pages (Imprint, Privacy).

## Example dialogue

**Dev:** A visitor asks the chatbot "does the arc work with thumb draw?" — should the bot answer about a curve?

**Expert:** No. "ARC" is the sideback quiver. The question is whether the ARC quiver suits the Thumb technique — and yes, ARC lists both Slavic and Thumb. WINGS is the only product where "nocking" itself is the point, since it's the nocking aid; for quivers, nocking technique just tells you which drawing style the rider uses.

**Dev:** And HORIZON only lists Slavic?

**Expert:** Right — HORIZON supports Slavic. Don't infer Thumb support just because ARC has it; each product states its own supported techniques.
