export interface RuleSection {
  id: string;
  title: string;
  body: string;
}

export const ruleSections: RuleSection[] = [
  {
    id: "herbivore-group-limits",
    title: "Límites de grupo herbívoros",
    body: `## Definición de agrupamiento
- Estar a **4× la longitud de tu cuerpo** de otro — aunque no estén agrupados físicamente — cuenta como agrupamiento y suma hacia los límites de grupo.
- Los límites de grupo son fijos; no se pueden superar los números listados y no son intercambiables.
- Aunque son omnívoros, **Gallis** y **Beipis** deben cumplir todas las reglas de herbívoros y no pueden cazar jugadores, ya que su dieta se limita a AI pequeño.
- Los Beipis que formen una relación con un deino (o deinos) deben seguir igualmente los límites de grupo previstos para esas situaciones.

## Sub adulto y crías
- Cada grupo puede llevar **1 sub adulto al 50%**.
- Si el sub ya supera el **50%**, queda fuera del cupo de sub y **cuenta como miembro** del límite de la especie.
- Las **crías extras** no cuentan al límite mientras estén por debajo del **35%**.
- A partir del **35%**, la cría debe retirarse del cupo de cría (ya no aplica como cría extra).

## Límites de grupo por especie
- **Gallimimus** — 8 miembros
- **Beipiaosaurus** — 10 miembros
- **Triceratops** — 2 miembros
- **Stegosaurus** — 3 miembros
- **Maiasaura** — 5 miembros
- **Diabloceratops** — 5 miembros
- **Kentrosaurus** — 5 miembros
- **Tenontosaurus** — 6 miembros
- **Pachycephalosaurus** — 8 miembros
- **Hypsilophodon** — 10 miembros
- **Dryosaurus** — 10 miembros`,
  },
  {
    id: "herbivore-herd-limits",
    title: "Límites de manada herbívora",
    body: `## Manadas mixtas herbívoras

- **Definición de manada mixta:**
  - Cuando un **Hypsi**, **Dryo** o **Beipi** se une a la manada, no se cuentan como parte de una manada mixta.
  - Que Hypsies, Dryos o Beipis pastoreen con otros herbívoros no convierte automáticamente la manada en mixta.
    - *Ejemplo:*
      - **Dryo + Hypsi + Beipi + Teno** ≠ Manada mixta
      - **Dryo + Hypsi + Beipi + Teno + Pachy** = Manada mixta

- **Capacidad de manada mixta:**
  - Una manada mixta debe respetar los límites de cupos definidos abajo.
  - Además, cada especie dentro de la manada no puede superar su **límite de grupo por especie**.

## Sub adulto y crías (todos los tiers)
- En **todos los tiers** la manada puede llevar **1 sub adulto al 50%**.
- Si ese sub supera el **50%**, queda fuera del cupo de sub y cuenta como miembro del límite.
- Las **crías extras** no cuentan al límite mientras estén por debajo del **35%**.
- A partir del **35%**, la cría debe retirarse del cupo de cría.

## Cupos (spots)

### TIER 1
**Especies:** Dryo | Hypsi | Beipi
**Límite:** según límite por especie (Dryo 10 · Hypsi 10 · Beipi 10)

### TIER 2
**Especies:** Galli | Pachy
**Límite:** 8 × cualquier tamaño (combinado)

### TIER 3
**Especies:** Teno | Maia
**Límite:** 6 × cualquier tamaño (combinado)

### TIER 4
**Especies:** Diablo | Kentro
**Límite:** 5 × cualquier tamaño (combinado)

### TIER 5 — Stegosaurus (aparte)
- **Stegosaurus** va **aparte** de los demás tiers de manada mixta.
- **Límite:** solo **3** Stegos.

### TIER 6 — Triceratops
- **Triceratops:** solo **2** Trikes.

## Manada mixta – Carnívoros (relación Beipi y Deinosuchus)

### Formación de la relación
- **Inicio:**
  - Un Beipi puede acercarse a un solo Deinosuchus o a un grupo de Deinosuchus que esté a **4× la longitud de tu cuerpo**, usando un call amistoso.
- **Respuesta del Deinosuchus:**
  - El Deinosuchus puede responder con un call amistoso o un call hostil como primera respuesta.
  - Si no hay respuesta, la relación no puede formarse.
  - Solo una respuesta con call amistoso permite formar la relación.

### Reglas y restricciones de la relación
- **Exclusividad:**
  - Un Beipi solo puede formar relación con un solo Deinosuchus o un grupo de Deinosuchus.
  - Durante esta relación, un máximo de **2 Beipis** puede unirse a un solo Deinosuchus o grupo de Deinosuchus.
  - Un Beipi **no puede** estar agrupado con herbívoros y Deinosuchus al mismo tiempo.
- **Condiciones de comportamiento:**
  - Deinos y Beipis en esta relación **no pueden cazar a otros Beipis**.
  - Los Beipis en la relación pueden ayudar scouting y baiting para los Deinos.
  - Deinos y Beipis pueden pelear el uno por el otro **solo si están en esta relación**.
- **Requisito de restablecimiento:**
  - Si un Beipi muere en combate mientras está en la relación, **debe restablecer** la relación si quiere formarla de nuevo con el mismo grupo.
- **Respaldo:**
  - Si no se forma una relación, el Beipi sigue las reglas normales de herbívoros.`,
  },
  {
    id: "carnivore-group-limits",
    title: "Límites de grupo carnívoros",
    body: `## Límite de pack carnívoro
- **Definición de agrupamiento:**
  - Estar a **4× la longitud de tu cuerpo** de otro — aunque no estén agrupados físicamente — cuenta como agrupamiento hacia los límites de grupo.
- **Prohibición de mix-pack:**
  - Los carnívoros no pueden hacer mix-pack; esto incluye simplemente permanecer cerca de otra especie, aunque no estén agrupados físicamente.
- **Requisito de separación:**
  - Carnívoros de distintas especies deben mantener una distancia mínima de **4× la longitud de tu cuerpo**.
- **Integridad del límite de grupo:**
  - Los límites de grupo son fijos y no intercambiables; no pueden superar los números listados.
- **Restricción de scavenger:**
  - Los scavengers no deben hacer scout para otros carnívoros.

## Sub adulto y crías
- Cada pack puede llevar **1 sub adulto al 50%**.
- Si el sub ya supera el **50%**, queda fuera del cupo de sub y **cuenta como miembro** del límite de la especie.
- Las **crías extras** no cuentan al límite mientras estén por debajo del **35%**.
- A partir del **35%**, la cría debe retirarse del cupo de cría (ya no aplica como cría extra).

## Límites de grupo por especie
- **Tyrannosaurus** — 2 miembros
- **Deinosuchus** — 2 miembros
- **Allosaurus** — 3 miembros
- **Ceratosaurus** — 4 miembros
- **Carnotaurus** — 4 miembros
- **Dilophosaurus** — 5 miembros
- **Omniraptor** — 8 miembros
- **Herrerasaurus** — 8 miembros
- **Pteranodon** — 10 miembros
- **Austroraptor** — 10 miembros
- **Troodon** — 10 miembros`,
  },
  {
    id: "general-combat",
    title: "Reglas generales de combate",
    body: `**1. Team Killing / Ataques dentro del grupo**
Está prohibido matar intencionadamente a un miembro de tu propio grupo. Como excepción, los **Herrerasaurus** podrán hacerlo.

Si surge un conflicto entre miembros del mismo grupo, deberán **separarse o abandonar la zona** antes de iniciar cualquier enfrentamiento.

---

**2. Abandono de grupo para atacar**
Está prohibido abandonar un grupo con la intención de atacar inmediatamente a quienes formaban parte de él.

Después de abandonar el grupo, deberá transcurrir un tiempo razonable que permita a ambas partes **separarse y reubicarse** antes de iniciar cualquier combate.

---

**3. Combates durante reinicios**
Todo combate deberá cesar inmediatamente cuando se anuncie un **reinicio oficial mediante RCON**.

También está prohibido atacar, perseguir o matar a jugadores que estén realizando **Safelog** debido al reinicio del servidor.

---

**4. Desconexiones durante situaciones hostiles**
Está prohibido aprovechar deliberadamente la desconexión, caída o pérdida de conexión de otro jugador para obtener una ventaja injusta.

La muerte de un jugador desconectado **no constituirá automáticamente una infracción**. Sin embargo, el Equipo Administrativo podrá sancionar la conducta si determina que existió **mala fe, abuso o aprovechamiento intencionado de la situación**.

---

**5. Combat Logging / Entomb**
Está prohibido desconectarse, realizar **Safelog** o utilizar **Entomb** mientras exista un combate activo o continúe cualquier tipo de interacción hostil.

El jugador deberá permanecer en el servidor hasta que el combate haya finalizado completamente.

---

**6. Body Denying**
Está prohibido realizar cualquier acción intencionada destinada a impedir que el vencedor pueda acceder al cadáver.

Esto incluye, entre otras acciones:

- Suicidarse intencionadamente.
- Ahogarse para negar el cuerpo.
- Lanzarse desde precipicios o hacia zonas inaccesibles.
- Introducir el cuerpo en lugares donde resulte imposible o excesivamente difícil acceder a él.
- Utilizar el entorno deliberadamente para impedir que el vencedor obtenga el cadáver.

Cualquier conducta realizada con este propósito será considerada **Body Denying**.

---

**7. Bloqueo de cadáveres por herbívoros**
Los herbívoros no podrán permanecer deliberadamente sobre un cadáver con la intención de impedir que otros jugadores puedan alimentarse de él.

Estar alimentándose de un cadáver **no otorga inmunidad frente a ataques**, por lo que otros jugadores podrán iniciar un enfrentamiento si las reglas generales de combate lo permiten.

---

**8. Finalización de un combate**
Un combate se considerará activo mientras exista cualquier tipo de **interacción hostil** entre las partes.

Esto incluye:

- Persecuciones activas.
- Ataques o intentos de ataque.
- Lenguaje corporal claramente agresivo.
- Acoso o presión directa sobre el oponente con intención de continuar el enfrentamiento.

Un combate podrá considerarse finalizado cuando haya cesado completamente la interacción hostil entre ambas partes.

Que uno o varios jugadores continúen recuperando **vida, sangrado o stamina** no significa por sí solo que el combate siga activo, siempre que ya no exista ninguna interacción hostil.

En situaciones dudosas, corresponderá al **Equipo Administrativo** determinar si el combate había finalizado o continuaba activo.
`,
  },
  {
    id: "no-overpacking",
    title: "No Overpacking",
    body: `- Está prohibido **cazar, atacar, intimidar o coordinarse** formando un grupo que supere el límite establecido para cada especie. Esto incluye bloquear el paso, perseguir, ahuyentar, atacar por turnos para aparentar grupos independientes o realizar cualquier otra acción coordinada que otorgue una ventaja sobre terceros. **Mantener distancia entre grupos no evita la infracción si existe colaboración.**

- Está permitido dejar restos de comida para otro grupo únicamente cuando el grupo inicial haya **abandonado completamente la zona** y ya no exista interacción o coordinación entre ambos grupos.

- Las crías podrán permanecer con sus padres hasta alcanzar el **40 % de crecimiento**. Una vez superado este porcentaje, deberán abandonar el grupo o sustituir a uno de los adultos para respetar el límite máximo permitido para la especie.

  Las crías que permanezcan bajo esta excepción **no podrán participar activamente en combates entre adultos**. Si son atacadas directamente, deberán limitarse a huir mientras los adultos del grupo las protegen.

- Si un jugador ajeno utiliza a tu grupo como refugio durante una persecución o combate, **no podrás intervenir en el conflicto**. Podrás reportar la situación posteriormente.

  Si el perseguidor ataca a tu grupo sin que haya finalizado previamente el combate con el jugador perseguido, la situación podrá ser revisada y sancionada por el Equipo Administrativo.

- Está prohibido **cambiar de grupo antes o durante un combate** con la finalidad de sustituir jugadores, reforzar a otro grupo o continuar el enfrentamiento utilizando integrantes diferentes.

  Únicamente podrán participar en el combate los jugadores que formaban parte del **grupo original y estaban presentes cuando comenzó el conflicto**.

## Comunicación externa

Compartir un canal de Discord, llamada, VC o cualquier otro medio de comunicación con jugadores que, en conjunto, superen el límite permitido para la especie **no exime del cumplimiento de esta norma**.

Es responsabilidad de los jugadores evitar cualquier coordinación que pueda interpretarse como colaboración entre grupos.

En caso de reporte, corresponderá al **Equipo Administrativo** analizar las pruebas y determinar si existió coordinación, colaboración o una ventaja obtenida mediante Overpacking.

## Convivencia temporal

Se permite que varios grupos de una misma especie permanezcan temporalmente en una misma zona, incluso si en conjunto superan el límite permitido, siempre que se encuentren **en reposo y sin realizar acciones coordinadas**.

Podrán socializar o compartir VC, pero no podrán:

- Desplazarse de forma conjunta e intencionada en la misma dirección durante un periodo prolongado.
- Cazar o perseguir conjuntamente.
- Defenderse mutuamente.
- Rodear, intimidar o bloquear a terceros.
- Coordinar ataques o movimientos.
- Realizar cualquier acción que otorgue una ventaja conjunta frente a otro jugador o grupo.

Esta excepción también aplica en **ríos, lagos y otros puntos de agua**.

La convivencia dejará de considerarse válida desde el momento en que exista **movilidad conjunta, cooperación o cualquier tipo de coordinación que beneficie a uno de los grupos frente a terceros**.
`,
  },
  {
    id: "combat-engagement",
    title: "Combate y enfrentamientos",
    body: `## Reglas de timer de combate

- **Ventana de 10 minutos sin acoso:**
  - Una vez que tu grupo inicia un enfrentamiento, ni tú ni ningún tercero que interfiera pueden atacar, acechar o cazar al mismo grupo después de que termine el combate — ni robar las cazas del otro — durante 10 minutos.
- **Protección de spawn:**
  - A los jugadores recién spawneados se les deben dar 10 segundos para empezar a moverse antes de poder atacarlos.
- **Protocolo de restart del servidor:**
  - Todo combate debe cesar cuando se anuncie un reinicio oficial; aplica también lo indicado en Reglas generales de combate (RCON / Safelog).
- **Sin combat logout:**
  - Desconectarse durante el combate está prohibido.

## Enfrentamiento de combate

- **Inicio del combate:**
  - El combate comienza en el momento en que se intercambian ataques o intentos de ataque entre jugadores/grupos — aunque el ataque falle.
  - Un intento de ataque solo se considera cuando el ataque fallido ocurre a 1× la longitud de tu cuerpo del oponente.

- **Enfrentamiento activo:**
  - Un enfrentamiento permanece activo mientras ambas partes estén en combate activo, lo que consiste en estar a 5× longitudes de cuerpo entre sí.

- **Fin del combate:**
  - El combate se considera terminado cuando alguna de las partes se aleja más de 5× longitudes de cuerpo y expira el periodo de gracia para reentrar, o cuando haya cesado toda interacción hostil (ver Reglas generales de combate).

- **Renuncia a la participación:**
  - Si te alejas más de 5× longitudes de cuerpo del área de combate y no regresas en 2 minutos, se considera que renunciaste a tu participación. Una vez renunciada, no puedes volver a ese combate.

- **Periodo de gracia de reentrada:**
  - Los jugadores que salen del rango de 5× longitudes de cuerpo tienen una ventana de 2 minutos para reentrar antes de considerarse fuera del enfrentamiento; sin embargo, durante ese tiempo fuera de las 5× longitudes de cuerpo no puedes atacar a otros jugadores. Además, si todos los miembros del grupo están fuera de las 5× longitudes de cuerpo, otros pueden robar tu cacería.

- **Protocolo post-combate:**
  - Tras terminar el combate, los combatientes deben dar a los oponentes 10 minutos para escapar.

## Regla de terceros

- **Elegibilidad de enfrentamiento:**
  - Los terceros pueden unirse y tomar un combate si el grupo cazador original está a más de 5× longitudes de cuerpo de distancia y ninguno de sus miembros permanece en combate activo.
- **Restricción:**
  - Si cualquier miembro del grupo original está a 5× longitudes de cuerpo, los terceros no pueden unirse al combate.`,
  },
  {
    id: "third-party",
    title: "Reglas de terceros",
    body: `## Regla general
- Los terceros no pueden participar en enfrentamientos, excepto las especies semiacuáticas especificadas.

## Criterios de participación
- Si no estás cerca de tu grupo cuando empieza un enfrentamiento, solo puedes unirte si puedes alcanzar el enfrentamiento en **30 segundos** desde el primer ataque.
- "Alcanzar el enfrentamiento" requiere estar a **5× la longitud de tu cuerpo** de las partes enfrentadas.

## Restricción de interferencia
- Si no eres miembro de ninguno de los grupos involucrados en el enfrentamiento, no puedes interferir — salvo que caigas bajo la excepción de terceros semiacuáticos.

## Cláusula de abandono del enfrentamiento
- Si un grupo cazador externo deja el rango de **5× longitudes de cuerpo** del grupo que está cazando, puedes intervenir y tomar la cacería de ellos.`,
  },
  {
    id: "semiaquatic-third-party",
    title: "Terceros semiacuáticos",
    body: `## [Deinosuchus y Austroraptor]

## Regla general
- Los semiacuáticos no pueden interferir en enfrentamientos que involucren a otros semiacuáticos.

## Interferencia en enfrentamientos terrestres
- Si un enfrentamiento terrestre pasa al agua o entra en ella, los semiacuáticos pueden interferir.

## Restricciones de interferencia en tierra
- Al interferir en una cacería que se mueve al agua o ocurre en ella, los semiacuáticos no deben seguir el enfrentamiento en tierra más allá de **1× la longitud de tu cuerpo** desde el borde del agua.`,
  },
  {
    id: "scavenger",
    title: "Reglas de carroñeros",
    body: `## Elegibilidad como scavengers
- **Troodons:**
  - Si hay dos o menos Troodons en un grupo, cuentan como scavengers y deben seguir las reglas de scavenger.
- **Pteranodons:**
  - Independientemente del tamaño del grupo, todos los Pteranodons cuentan como scavengers y deben seguir las reglas de scavenger.
- **Herrerasaurus solo:**
  - Un solo herrerasaurus de cualquier tamaño cuenta como scavenger y debe seguir las reglas de scavenger.

## Alimentarse de cadáveres

- Los scavengers pueden intentar comer de un cuerpo — bajo su propio riesgo.
- Si el grupo les da permiso para comer, no pueden matar a esos scavengers mientras comen.
- Si comienza un combate por el cuerpo, los scavengers deben huir y no participar.
- Los scavengers no necesitan permanecer con el cuerpo después de matarlo.

## Regla solo scavenger (caza de nidos)

### Opción A: Mover cuerpos de hatchling
- **Acción permitida:**
  - Los scavengers pueden recoger los cuerpos de hatchling que maten y alejarlos si es necesario.
- **Restricción de regreso:**
  - Tras reubicar un cuerpo de hatchling, los scavengers solo pueden volver al nido para seguir cazando de forma razonable; no se permite el abuso repetido sobre el mismo nido.

### Opción B: Consumo inmediato
- **Acción permitida:**
  - Alternativamente, los scavengers pueden elegir comer el hatchling que maten de inmediato.
- **Oportunidad perdida:**
  - Elegir comer de inmediato pierde la chance de volver al mismo nido a cazar durante 10 minutos.`,
  },
  {
    id: "semiaquatic",
    title: "Reglas semiacuáticas",
    body: `## [Deinosuchus y Austroraptor]

## Regreso al agua
- Los dinos semiacuáticos pueden volver al agua durante un enfrentamiento.
- La parte contraria puede perseguirlos al agua, pero lo hace enteramente bajo su propio riesgo.

## Cadáveres
- Los dinos semiacuáticos pueden llevar cadáveres de vuelta al agua, aunque el cuerpo se haya caído inicialmente en tierra.`,
  },
  {
    id: "ambush-predator",
    title: "Depredadores de emboscada",
    body: `## ¿Quiénes son los depredadores de emboscada?
- Deinosuchus
- Herrerasaurus

## 1. Quién puede usar cuerpos como bait
- **Depredadores permitidos:**
  - Los depredadores de emboscada, específicamente **Herrera** y **Deino**, pueden usar cuerpos como bait.
- **Cuerpos elegibles:**
  - Cualquier cuerpo puede usarse.

## 2. Límites de cuerpo bait y “stacking”
- **Regla de uno a la vez:**
  - Un depredador de emboscada puede tener **un cuerpo bait activo a la vez.**
- **Límite de stacking:**
  - Si un cuerpo bait se usa para asegurar una kill y esa kill produce otro cuerpo, no se puede usar bait adicional hasta que uno de los cuerpos deje de estar en juego (podrido o hayan pasado 5 minutos).
  - En la práctica, nunca puede haber más de dos cuerpos (el bait más la nueva kill) en juego del mismo depredador.

## 3. Preparación del bait y requisitos de rango
- **Rango de colocación:**
  - Los depredadores de emboscada pueden colocar su cuerpo bait a distancia — hasta el rango máximo de su método de ataque (**salto de Herrera** o **lunge de Deino**) — siempre que permanezcan dentro de ese rango al intentar emboscar.

## 4. Excepciones de emboscada
- **Deino:** Puede emboscar si el cuerpo está dentro del rango de lunge mientras está en el agua y el cuerpo está junto al borde del agua.
- **Herrera:** Puede emboscar si la kill se hizo dentro del **timer de 2 minutos** desde que la presa empieza a alimentarse del cuerpo.
- **Comer de cuerpos bait:**
  - Los jugadores no recibirán strike por comer de un cuerpo bait, siempre que puedan ver que nadie está sentado junto a él.`,
  },
  {
    id: "nesting",
    title: "Reglas de nesting",
    body: `## Reglas generales del grupo de nesting
- Cuando un grupo produce un nido con huevos o tiene hatchlings/crías, se considera un nesting party.
- Los nesting parties están formados por padres (adultos/subadultos) y crías (hatchlings) dentro de sus sitios de nesting.
- Los límites de grupo deben seguirse durante el nesting.
- Los nidos con huevos o hatchlings otorgan protección de nido tanto a los padres como a sus crías/huevos. La protección del nido aplica hasta 2× la longitud de cuerpo del padre desde el nido; cualquier cosa más allá de esos límites ya no otorga protección.
- Todos los miembros del grupo aún pueden ser cazados o enfrentados según las reglas de combate.

## Apuntar a un nido
- Si un grupo cazador apunta a un nesting party, debe dar a los padres **10 segundos** para abandonar el nido y alejarse más de 2× longitudes de cuerpo antes de iniciar el enfrentamiento.
- Si el nesting party (padres/crías) ya está a 2× la longitud de cuerpo del padre del nido, se puede iniciar el enfrentamiento de inmediato.
- Los padres no pueden volver a su nido en ningún momento mientras un enfrentamiento siga activo.
- Al cazar un nesting party con hatchlings, tanto los hatchlings en el nido como el nido en sí están fuera de límites.
  - **Excepción para scavengers:** Los scavengers pueden arrebatar hatchlings de un nido, pero lo hacen bajo su propio riesgo.

## Comportamiento de los padres
- Tras vaciar el nido, puede comenzar el enfrentamiento. Si los padres no abandonan el nido en 10 segundos tras el aviso inicial, las protecciones del nido expiran y el grupo cazador puede atacar a los padres en el nido. Se pierde la seguridad asumida de las crías en el nido y se consideran en combate cuando se enfrentan a los padres.
- Si un depredador entra a 4× longitud de cuerpo de un nido herbívoro, los padres pueden advertirle y deben darle **10 segundos** para retirarse. Si no se van, los padres pueden atacar al depredador.

## Cadáveres cerca de nidos
- Si hay un cuerpo en o cerca de un nido herbívoro que un carnívoro desea comer, el carnívoro debe acercarse despacio.
- Si es posible, el carnívoro debe arrastrar o cargar el cuerpo lejos del nido antes de comerlo. Si el cuerpo es demasiado grande para moverlo, puede comerse donde está.
- Los nesting parties herbívoros a los que se acerca un carnívoro para alimentarse deben permitir el acceso y no atacarlo.
- El carnívoro no debe atacar el nido, hatchlings ni herbívoros en ningún momento durante este proceso.
- El nesting party puede quedarse seguro en su nido independientemente de la distancia al nido o del tiempo que el carnívoro esté alimentándose.
- Una vez terminado el cuerpo, el carnívoro debe abandonar el área y abstenerse de atacar o cazar a ese nesting party durante 10 minutos.

## Restricciones adicionales
- Nest hopping o unirse a nidos para desperdiciar huevos está prohibido.
- Los nidos solo pueden destruirse si no hay padres a la vista.
- Los padres del nido no pueden matar a las crías en ningún momento.
- El nido debe colocarse en una ubicación apropiadamente visible.`,
  },
  {
    id: "egg-interaction",
    title: "Interacción con huevos",
    body: `## 1. Robo de huevos por scavengers
- **Acción permitida:** Solo los scavengers pueden robar huevos cuando un padre está presente en el nido.
- **Factor de riesgo:** Los scavengers roban huevos bajo su propio riesgo.
- **Límite de cantidad:** No hay límite al número de huevos que un scavenger puede robar.

## 2. Restricciones de robo de huevos para carnívoros no-scavenger
- **Acción prohibida:** Los carnívoros que no están clasificados como scavengers no pueden robar huevos si hay un padre a la vista.

## 3. Consumo de huevos por carnívoros
- **Fuentes permitidas:**
  - **Nidos abandonados:** Los carnívoros pueden comer huevos encontrados en nidos abandonados.
  - **Kills propias:** Los carnívoros pueden comer huevos de una kill que hicieron ellos mismos.
  - **Cadáveres encontrados:** Los carnívoros también pueden comer huevos de un cuerpo que encontraron.

**Nota importante:** Los huevos no otorgan ninguna protección especial asociada a un cadáver.

## 4. Reglas específicas para Galli y Beipi
- **Restricciones de consumo:** Galli y Beipi solo pueden comer huevos si se encuentran en un nido abandonado.
- **Prohibición de robo:** No pueden robar huevos de cuerpos abiertos.`,
  },
  {
    id: "stream-sniping",
    title: "Stream Sniping",
    body: `- Está estrictamente prohibido utilizar transmisiones en directo, clips, retransmisiones, pantallas compartidas o cualquier otra fuente externa para **localizar jugadores, conocer su posición, seguir sus movimientos u obtener cualquier tipo de ventaja dentro del servidor**.

- Esta norma también aplica cuando la información sea obtenida **de forma indirecta**, por ejemplo, a través de otra persona que esté viendo una transmisión y comparta ubicaciones, movimientos o información relevante.

- Utilizar información obtenida mediante una transmisión para **cazar, evitar, perseguir, emboscar o anticiparse a las acciones de otro jugador** será considerado Stream Sniping.

**El Stream Sniping se considera una infracción grave y, dependiendo de las pruebas y la gravedad del caso, podrá conllevar una sanción severa o la expulsión permanente del servidor.**
`,
  },
  {
    id: "bot-bug-abuse",
    title: "Abuso de bots, bugs o exploits",
    body: `- El comando **/unstuck** únicamente podrá utilizarse cuando el dinosaurio se encuentre realmente atascado y no exista una forma normal de salir de la situación. Utilizarlo para escapar de un combate, persecución, peligro o para obtener cualquier ventaja será considerado abuso.

- Está prohibido utilizar **cuentas adicionales, cuentas alternativas o múltiples cuentas controladas por una misma persona** con el objetivo de obtener información, recursos, personajes o cualquier otra ventaja dentro del servidor.

- Está estrictamente prohibido aprovechar de forma intencionada cualquier **bug, glitch, exploit, hack, macro, modificación o programa de terceros** que altere el funcionamiento normal del juego o proporcione una ventaja injusta sobre otros jugadores.

## Ejemplos de abuso

Se consideran exploits o abusos, entre otros:

- **Trike Push.**
- **Deino Super Lunge.**
- **Rex Crouch Crush.**
- Cancelar animaciones para atacar, moverse o realizar acciones más rápido de lo permitido.
- Aumentar artificialmente la velocidad o frecuencia de los ataques.
- Utilizar fallos del terreno, rocas, estructuras, puentes, paredes invisibles o zonas inaccesibles para atacar, esconderse o evitar recibir daño.
- **Sitting Bug** y cualquier otro fallo relacionado con animaciones, hitboxes o movimientos.
- Repetir deliberadamente una mecánica bugueada para obtener una ventaja en combate.
- Utilizar herramientas externas para obtener información que normalmente no estaría disponible dentro del juego.

## Consideraciones

La lista anterior es únicamente orientativa. **No es necesario que un exploit aparezca expresamente mencionado en las reglas para que pueda ser sancionado.**

Cualquier mecánica, error o comportamiento que sea utilizado de forma intencionada para obtener una ventaja que no forme parte del funcionamiento normal del juego podrá ser considerado **abuso de bug o exploit**.

Si un jugador descubre un bug o exploit, deberá evitar utilizarlo y **reportarlo al Equipo Administrativo**.

**El desconocimiento de que una determinada mecánica constituye un exploit no garantiza la retirada de una sanción cuando exista un abuso evidente o reiterado.**
`,
  },
  {
    id: "other-rules",
    title: "Otras reglas",
    body: `- **Respeto:**
  - No faltes el respeto al staff.
  - No uses nombres de usuario ofensivos o inapropiados.

- **Comunicación y calls:**
  - No hagas spam de calls, excepto Gallis que pueden usar sus calls para boost de carrera.
  - Cuando están idle, los Gallis no pueden spamear calls.

- **Hosting de eventos:**
  - No organices eventos personales en el servidor sin permiso expreso de Isla Prime, el Manager o Head Admins.

- **Conducta post-enfrentamiento:**
  - No vuelvas al grupo que te atacó o mató para insultar, menospreciar o provocar.

- **Ubicación y metagaming:**
  - Solo puedes dropear tu **propia** ubicación.
  - Sin metagaming: No compartas ubicaciones de jugadores, no avises de grupos/ubicaciones peligrosas/puntos seguros, ni ayudes a jugadores fuera de tu grupo a encontrar recursos.
  - No engañes a la gente por VC o texto para revelar ubicaciones con intención maliciosa (p. ej., para atacarlos o matarlos).

- **Uso de bot:**
  - No puedes usar ninguna función de bot durante un enfrentamiento activo. Además, tras usar cualquier función relacionada con bot, como Grows, Teleporting o Slays, debes esperar 2 minutos antes de iniciar o unirte a cualquier combate.

- **Campear sanctuaries:**
  - Una vez que un carnívoro alcanza **50%** de growth, queda restringido de atacar o matar a cualquier jugador por debajo de **50%** de growth que esté dentro o cerca de un sanctuary.
  - **Cerca de un sanctuary incluye:** jugadores entrando a un sanctuary, jugadores saliendo de un sanctuary, y a lo largo del límite/borde de un sanctuary.
  - Los scavengers están exentos de esta regla.

- **Desinformación:**
  - No difundas desinformación.

- **Represalias:**
  - Si alguien rompe una regla contra ti o en general, no rompas una regla a cambio.`,
  },
  {
    id: "strike-system",
    title: "Sistema de strikes",
    body: `## Resumen
Cada infracción de regla en el servidor Evrima Semi-Realism resulta en un Strike en tu historial, que expirará tras **3 meses**.

## Niveles de Strike
- **Strike 1**
- **Strike 2:** Resulta en un **ban de 24 horas**
- **Strike 3:** Resulta en un **ban de 7 días**
- **Strike 4:** Resulta en un **ban de 90 días**

## Notas importantes
- **Requisito de verificación:**
  - Si no estás verificado y recibes un strike, serás baneado hasta que te verifiques.
  - Verifícate usando el botón \`Verify\` en el servidor de Discord.
  - Puedes apelar un ban, pero el strike permanece en el historial a menos que la apelación sea exitosa.
- **Duración adicional de ban:**
  - Por cada Strike acumulado **por encima del Strike 4**, se añaden **7 días** extra al ban de 90 días.
- **Nickname de Discord:**
  - Para mantenerte informado sobre strikes, asegúrate de que tu nickname de Discord coincida con tu nombre in-game.
- **Apelaciones:**
  - Si recibes cualquier strike, crea un ticket de Appeal en **#contact-staff**.

## Infracciones de ban

### BAN DE 3 MESES
- **Nest Griefing:**
  - Hatchar para matar hatchlings o romper nidos a propósito.

### PERMABAN
- Cualquier forma de hate-speech o discriminación.
- Acoso, bullying o comportamiento malicioso.
- Incitación a autolesión/suicidio (p. ej., decir "kys").
- Temas NSFW/explícitos, conducta indebida o comportamientos similares.
- Falta de respeto continua hacia el staff.
- Suplantar a staff o miembros del equipo.
- Publicidad o autopromoción.
- Abusar de bugs graves, glitches, exploits u otros métodos que rompan el juego.
- Romper o ignorar reglas a propósito.
- Acumular suficientes strikes para ser baneado una segunda vez.
- Evasión de ban.`,
  },
];

/** Resúmenes breves para imports legacy */
export const serverRules: { title: string; description: string }[] = [
  {
    title: "Límites de grupo",
    description:
      "Límites por especie. Sin Overpacking. 1 sub al 50%; crías extras según regla aplicable. Stego 3 y Trike 2 en manada.",
  },
  {
    title: "Combate",
    description:
      "TK, abandonos, RCON/Safelog, Entomb, Body Denying y fin del combate cuando cesa la hostilidad.",
  },
  {
    title: "Conducta",
    description:
      "Sin Stream Sniping. Sin abuso de bots, bugs o exploits. Metagaming y sanciones según strikes.",
  },
  {
    title: "Nesting y huevos",
    description:
      "Protección de nido a 2× longitud del padre. Scavengers pueden arriesgarse con hatchlings y huevos.",
  },
  {
    title: "Strikes",
    description:
      "Cada infracción da un Strike (expira a los 3 meses). Strike 4 = ban de 90 días; hate-speech es permaban.",
  },
];

export const discordRules: string[] = [
  "Respeta a staff y jugadores en todos los canales.",
  "No compartas información personal de otros miembros.",
  "Usa los canales correctos para reportes, tickets y sugerencias.",
  "Sin hate-speech, acoso, bullying ni temas NSFW.",
  "Publicidad de otros servidores sin permiso está prohibida.",
  "No suplantes a staff ni hagas spam.",
];
