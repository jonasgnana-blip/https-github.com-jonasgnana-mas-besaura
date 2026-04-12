// ── i18n translations ──────────────────────────────────────────────────────────
// Supports "es" (Castellano) and "ca" (Català)
// Usage: t[lang].key

export type Lang = "es" | "ca";

const translations = {
  es: {
    // ── NavBar ──────────────────────────────────────────────────────────────
    nav_la_casa: "La Casa",
    nav_alojamiento: "Alojamiento",
    nav_actividades: "Actividades",
    nav_alquiler: "Alquiler",
    nav_reservar: "Reservar",

    // ── Home — Hero ─────────────────────────────────────────────────────────
    home_hero_subtitle: "Un lugar seguro entre ríos y bosques salvajes para tu sanación y despertar.",
    home_hero_cta_alojamiento: "Ver alojamiento",
    home_hero_cta_casa: "Descubrir la casa",

    // ── Home — Propósito ────────────────────────────────────────────────────
    home_proposito_label: "Nuestro Propósito",
    home_proposito_title: "Una masía entre hayedos, ríos y cascadas",
    home_proposito_p1: "Mas Besaura es una masía tradicional restaurada con amor y respeto por su entorno natural: hayedos, ríos salvajes, cascadas luminosas, ermitas ancestrales.",
    home_proposito_p2: "Organizamos retiros y actividades con el propósito de reconocer nuestra naturaleza esencial, sanar los vínculos familiares y la relación entre hombres y mujeres. Puedes alquilar la casa y la sala exterior — un antiguo granero de 350 m².",
    home_proposito_feat1: "Actividades terapéuticas y de ocio familiar",
    home_proposito_feat2: "Diseño personalizado de sanación individual y de pareja",
    home_proposito_feat3: "Equipo multidisciplinar",

    // ── Home — Actividades section ──────────────────────────────────────────
    home_act_label: "Qué ofrecemos",
    home_act_title1: "Un espacio de integración",
    home_act_title2: "para el alma y el cuerpo",
    home_act_retiros_title: "Retiros",
    home_act_retiros_desc: "Yoga, meditación, danza, trabajo con el fuego, constelaciones familiares. Espacios de pausa y cuidado en entornos naturales sin wifi.",
    home_act_retiros_tag1: "Sanación",
    home_act_retiros_tag2: "Grupos & Individual",
    home_act_familiar_title: "Actividades Familiares",
    home_act_familiar_desc: "Rutas por el bosque, noches de estrellas, huerto ecológico y juegos al aire libre. La naturaleza como aula.",
    home_act_familiar_tag1: "Todas las edades",
    home_act_familiar_tag2: "Todo el año",
    home_act_talleres_title: "Talleres",
    home_act_talleres_desc: "Cerámica, cocina tradicional, cestería, fermentación, gestión emocional. Aprendizajes que conectan las manos con la tierra.",
    home_act_talleres_tag1: "Fin de semana",
    home_act_talleres_tag2: "Grupos pequeños",

    // ── Home — Actividades CTA ──────────────────────────────────────────────
    home_actcta_label: "Experiencias",
    home_actcta_title: "Actividades & Talleres",
    home_actcta_desc: "Rutas familiares, constelaciones, inmersiones terapéuticas y mucho más. Diseñadas para reconectar con la naturaleza y contigo mismo.",
    home_actcta_btn: "Ver actividades",

    // ── Home — Alquiler CTA ─────────────────────────────────────────────────
    home_alqcta_label: "Para grupos y profesionales",
    home_alqcta_title: "Alquila La Cabanya",
    home_alqcta_desc: "350 m² de sala granero con vistas al valle. Ideal para retiros, eventos, formaciones y encuentros de hasta 100 personas.",
    home_alqcta_btn: "Ver condiciones de alquiler",

    // ── Home — Footer ───────────────────────────────────────────────────────
    footer_desc: "Casa rural en Vidrà, Girona. Un espacio seguro entre ríos y bosques salvajes para tu sanación y despertar.",
    footer_contact: "Contacto",
    footer_location: "Vidrà, Girona · Cataluña",
    footer_como_llegar: "Cómo llegar",
    footer_accesos: "Accesos rápidos",
    footer_retiros: "Retiros",
    footer_talleres: "Talleres",
    footer_reservar: "Reservar",
    footer_rights: "Todos los derechos reservados.",

    // ── Alojamiento page ────────────────────────────────────────────────────
    aloj_hero_subtitle: "Tres habitaciones únicas entre bosques y ríos",
    aloj_rooms_label: "Las habitaciones",
    aloj_rooms_title: "Tres diosas que custodian tu descanso",
    aloj_room_artemisa_desc: "2 camas individuales y una cama doble, con baño. Estufa de pellets. Orientación este.",
    aloj_room_selene_desc: "Habitación con altillo. 2 camas individuales abajo, 2 camas individuales arriba. Estufa de pellets. Orientación norte.",
    aloj_room_hecate_desc: "2 camas individuales y una cama doble. Estufa de pellets. Orientación oeste.",
    aloj_btn_desayuno: "Desayuno",
    aloj_btn_media_pension: "Media Pensión",
    aloj_btn_close: "✕ Cerrar",
    aloj_booking_desayuno: "Alojamiento + Desayuno",
    aloj_booking_media_pension: "Alojamiento + Media Pensión",
    aloj_booking_fecha_label: "Fechas",
    aloj_booking_personas_label: "Número de personas",
    aloj_booking_max: "máx.",
    aloj_booking_complementos_label: "Complementos",
    aloj_booking_contacto_label: "Datos de contacto",
    aloj_booking_nombre_ph: "Nombre completo",
    aloj_booking_email_ph: "Correo electrónico",
    aloj_booking_tel_ph: "Teléfono",
    aloj_booking_resumen: "Resumen",
    aloj_booking_total: "Total",
    aloj_booking_noches: "noche",
    aloj_booking_noches_pl: "noches",
    aloj_booking_persona: "persona",
    aloj_booking_personas: "personas",
    aloj_booking_por_noche: "por noche",
    aloj_booking_precio_unico: "precio único",
    aloj_booking_procesando: "Procesando...",
    aloj_booking_reservar_pagar: "Reservar y pagar",
    aloj_booking_error_fechas: "Por favor selecciona las fechas de entrada y salida.",
    aloj_booking_error_contacto: "Por favor completa todos los campos de contacto.",
    aloj_cal_entrada: "Selecciona la fecha de entrada",
    aloj_cal_salida: "Selecciona la fecha de salida",
    aloj_cal_dias: "día",
    aloj_cal_dias_pl: "días",

    // ── Cabanya (Alojamiento) ───────────────────────────────────────────────
    aloj_cabanya_label: "Sala exterior",
    aloj_cabanya_title: "La Cabanya · Sala Granero",
    aloj_cabanya_desc: "350 m² de sala con suelo de microcemento mirando al valle. Soleada en invierno y con sombra en verano. Con baño, cocina eléctrica, platos, vasos y utensilios. Capacidad para más de 100 personas.",
    aloj_cabanya_price: "10€ por persona · día",
    aloj_cabanya_consultar: "Consultar disponibilidad",
    aloj_cabanya_fecha_label: "Fecha del evento",
    aloj_cabanya_personas: "personas",
    aloj_cabanya_total: "Total:",
    aloj_cabanya_btn: "Reservar Cabanya",
    aloj_cabanya_error_fecha: "Por favor selecciona una fecha.",

    // ── Complementos section ────────────────────────────────────────────────
    compl_label: "Enriquece tu estancia",
    compl_title: "Complementos disponibles",
    compl_desc: "Añade estos servicios al realizar tu reserva para una experiencia más completa.",

    // ── Actividades page ────────────────────────────────────────────────────
    act_label: "Naturaleza · Terapia · Familia",
    act_title: "Actividades",
    act_subtitle: "Experiencias en la naturaleza y el alma",
    act_contact_fechas: "Contacta con nosotros para fechas",

    // ── ActividadCard ───────────────────────────────────────────────────────
    act_card_reservar: "Reservar",
    act_card_cerrar: "Cerrar",
    act_card_persona: "persona",
    act_card_comida: "Comida Casera — 15€",
    act_card_comida_btn: "Reservar Comida Casera",
    act_card_comida_label: "Nombre completo",
    act_card_email_ph: "Correo electrónico",
    act_card_tel_ph: "Teléfono",
    act_card_personas_label: "Personas",
    act_card_fecha_label: "Selecciona una fecha",
    act_card_confirmar: "Confirmar reserva",
    act_card_error_fecha: "Por favor selecciona una fecha.",
    act_card_cabanya_btn: "Reservar La Cabanya — 10€/persona",
    act_card_cabanya_sala: "Reservar Sala",
    act_card_personas_txt: "personas",
    act_card_error_conexion: "Error de conexión. Inténtalo de nuevo.",

    // ── Alquiler page ───────────────────────────────────────────────────────
    alq_cabanya_tipo: "Alquiler de espacio",
    alq_cabanya_title: "La Cabanya · Sala Granero",
    alq_cabanya_price: "10€ por persona · día",
    alq_cabanya_desc: "350 m² de sala con suelo de microcemento mirando al valle. Con baño, cocina eléctrica, platos y utensilios. Para eventos, actividades, comidas familiares... Hasta 100 personas.",
    alq_cabanya_consultar: "Consultar disponibilidad",
    alq_cabanya_fecha_label: "Fecha del evento",
    alq_cabanya_personas_label: "Número de personas",
    alq_cabanya_contacto_label: "Datos de contacto",
    alq_cabanya_nombre_label: "Nombre",
    alq_cabanya_email_label: "Email",
    alq_cabanya_tel_label: "Teléfono",
    alq_cabanya_nombre_ph: "Tu nombre",
    alq_cabanya_tel_ph: "+34 000 000 000",
    alq_cabanya_error_fecha: "Por favor selecciona una fecha.",
    alq_cabanya_error_contacto: "Por favor completa nombre y email.",
    alq_cabanya_reservar: "Reservar La Cabanya",
    alq_casa_tipo: "Casa completa",
    alq_casa_title: "Alquiler Casa para Retiros",
    alq_casa_price: "80€ por persona · día",
    alq_casa_desc: "La masía completa para grupos y retiros. Hasta 12 personas. Incluye todas las habitaciones, salones, cocina y jardín. Precio basado en personas y días de estancia.",
    alq_casa_consultar: "Consultar disponibilidad",
    alq_casa_fechas_label: "Fechas de entrada y salida",
    alq_casa_personas_label: "Número de personas",
    alq_casa_50: "50% para reservar",
    alq_casa_contacto_label: "Datos de contacto",
    alq_casa_nombre_label: "Nombre",
    alq_casa_email_label: "Email",
    alq_casa_tel_label: "Teléfono",
    alq_casa_nombre_ph: "Tu nombre",
    alq_casa_tel_ph: "+34 000 000 000",
    alq_casa_error_fechas: "Por favor selecciona las fechas de entrada y salida.",
    alq_casa_error_contacto: "Por favor completa nombre y email.",
    alq_casa_reservar_mitad: "Reservar con el 50%",
    alq_casa_reservar_total: "Importe completo",
    alq_dias: "días",
    alq_cerrar: "Cerrar",

    // ── La Casa page ────────────────────────────────────────────────────────
    lacasa_title: "La Casa",
    lacasa_intro_label: "Espacio & Naturaleza",
    lacasa_intro: "La masía puede alojarse hasta 14 personas — 12 participantes más 2 facilitadores. Dispone de tres habitaciones, sala interior, salón comedor y la gran sala exterior La Cabanya. Rodeada de hayedos, ríos salvajes y cascadas, es un refugio para el descanso y la transformación.",
    lacasa_rooms_label: "Habitaciones",
    lacasa_rooms_title: "Tres diosas que custodian tu descanso",
    lacasa_espacios_label: "Espacios Comunes",
    lacasa_espacios_title: "Lugares para el encuentro",
    lacasa_cta_label: "Alojamiento",
    lacasa_cta_title: "Quédate a dormir",
    lacasa_cta_desc1: "Alojamiento + desayuno — 45€/noche por persona",
    lacasa_cta_desc2: "Alojamiento + media pensión — 60€/noche por persona",
    lacasa_cta_nota: "La pensión completa se ofrece únicamente en los Retiros organizados. Al mediodía puedes cocinarte en la casa o explorar los alrededores — muy aconsejable.",
    lacasa_cta_btn: "Consultar disponibilidad",
    lacasa_cta_title2: "Ven a inspirarte y descansar",

    // ── Habitación names/descriptions (La Casa) ─────────────────────────────
    lacasa_artemisa_nombre: "Habitación Artemisa",
    lacasa_artemisa_desc: "Habitación doble con vistas al bosque y la montaña. Nombrada en honor a la diosa de la naturaleza y la luna, ofrece un refugio íntimo entre la piedra original de la masía.",
    lacasa_artemisa_cap: "2 personas",
    lacasa_selene_nombre: "Habitación Selene",
    lacasa_selene_desc: "Habitación doble con baño privado. Selene, la luna llena, inspira este espacio luminoso que baña sus paredes de cal con la luz suave de cada mañana.",
    lacasa_selene_cap: "2 personas",
    lacasa_hecate_nombre: "Habitación Hécate",
    lacasa_hecate_desc: "Habitación triple con vistas al valle. Hécate guarda los umbrales y los sueños — este cuarto de techos altos y vigas de madera invita al descanso profundo.",
    lacasa_hecate_cap: "3 personas",

    // ── Espacios comunes (La Casa) ──────────────────────────────────────────
    lacasa_sala_interior_nombre: "Sala Interior",
    lacasa_sala_interior_sub: "26 m²",
    lacasa_sala_interior_desc: "Sala multiusos con suelo de cemento pulido, paredes de cal y vigas de madera. Perfecta para yoga, meditación, talleres o círculos de trabajo en grupos reducidos.",
    lacasa_salon_nombre: "Salón Comedor",
    lacasa_salon_sub: "Para invitados",
    lacasa_salon_desc: "Espacio compartido con mesa grande de madera, cocina equipada y chimenea de piedra. El lugar donde los grupos se reúnen para compartir las comidas y las conversaciones del día.",
    lacasa_sala_estar_nombre: "Sala Estar · Cocina",
    lacasa_sala_estar_sub: "Zona privada",
    lacasa_sala_estar_desc: "Estancia con cocina completa, zona de lectura y acceso directo al jardín. Disponible para grupos que alquilan la casa completa.",

    // ── Espacios comunes — card Habitaciones ────────────────────────────────
    lacasa_esp_habs_nombre: "Habitaciones",
    lacasa_esp_habs_sub: "Tres diosas",
    lacasa_esp_habs_desc: "Tres habitaciones únicas de piedra y madera, cada una con su carácter: Artemisa, Selene y Hécate. Paredes de cal, suelos antiguos y luz que entra despacio.",

    // ── Capacidades reales de habitaciones (La Casa page) ───────────────────
    lacasa_artemisa_cap_real: "4 personas",
    lacasa_selene_cap_real: "4 personas",
    lacasa_hecate_cap_real: "4 personas",

    // ── Descripciones reales de habitaciones (La Casa page) ─────────────────
    lacasa_artemisa_desc_real: "Habitación con camas individuales y cama doble, suelo de madera original, paredes de piedra encalada y lámpara de esparto. Nombrada en honor a la diosa de la naturaleza y la luna.",
    lacasa_selene_desc_real: "Habitación con altillo. Camas individuales abajo y arriba, suelo de madera antigua y ventana con contraventanas de madera. Selene, la luna llena, inspira este espacio luminoso.",
    lacasa_hecate_desc_real: "Habitación amplia con múltiples camas individuales, estufa de pellets, paredes blancas y luz natural generosa. Hécate guarda los umbrales y los sueños.",

    // ── Footer mínimo La Casa / Actividades ─────────────────────────────────
    footer_rights_short: "Todos los derechos reservados.",
  },

  ca: {
    // ── NavBar ──────────────────────────────────────────────────────────────
    nav_la_casa: "La Casa",
    nav_alojamiento: "Allotjament",
    nav_actividades: "Activitats",
    nav_alquiler: "Lloguer",
    nav_reservar: "Reservar",

    // ── Home — Hero ─────────────────────────────────────────────────────────
    home_hero_subtitle: "Un lloc segur entre rius i boscos salvatges per a la teva sanació i despertar.",
    home_hero_cta_alojamiento: "Veure allotjament",
    home_hero_cta_casa: "Descobrir la casa",

    // ── Home — Propósito ────────────────────────────────────────────────────
    home_proposito_label: "El Nostre Propòsit",
    home_proposito_title: "Una masia entre fagedes, rius i cascades",
    home_proposito_p1: "Mas Besaura és una masia tradicional restaurada amb amor i respecte pel seu entorn natural: fagedes, rius salvatges, cascades lluminoses, ermites ancestrals.",
    home_proposito_p2: "Organitzem retirs i activitats amb el propòsit de reconèixer la nostra naturalesa essencial, sanar els vincles familiars i la relació entre homes i dones. Pots llogar la casa i la sala exterior — un antic graner de 350 m².",
    home_proposito_feat1: "Activitats terapèutiques i d'oci familiar",
    home_proposito_feat2: "Disseny personalitzat de sanació individual i de parella",
    home_proposito_feat3: "Equip multidisciplinar",

    // ── Home — Actividades section ──────────────────────────────────────────
    home_act_label: "Què oferim",
    home_act_title1: "Un espai d'integració",
    home_act_title2: "per a l'ànima i el cos",
    home_act_retiros_title: "Retirs",
    home_act_retiros_desc: "Ioga, meditació, dansa, treball amb el foc, constel·lacions familiars. Espais de pausa i cura en entorns naturals sense wifi.",
    home_act_retiros_tag1: "Sanació",
    home_act_retiros_tag2: "Grups & Individual",
    home_act_familiar_title: "Activitats Familiars",
    home_act_familiar_desc: "Rutes pel bosc, nits d'estrelles, hort ecològic i jocs a l'aire lliure. La natura com a aula.",
    home_act_familiar_tag1: "Totes les edats",
    home_act_familiar_tag2: "Tot l'any",
    home_act_talleres_title: "Tallers",
    home_act_talleres_desc: "Ceràmica, cuina tradicional, cistelleria, fermentació, gestió emocional. Aprenentatges que connecten les mans amb la terra.",
    home_act_talleres_tag1: "Cap de setmana",
    home_act_talleres_tag2: "Grups petits",

    // ── Home — Actividades CTA ──────────────────────────────────────────────
    home_actcta_label: "Experiències",
    home_actcta_title: "Activitats & Tallers",
    home_actcta_desc: "Rutes familiars, constel·lacions, immersions terapèutiques i molt més. Dissenyades per reconnectar amb la natura i amb tu mateix.",
    home_actcta_btn: "Veure activitats",

    // ── Home — Alquiler CTA ─────────────────────────────────────────────────
    home_alqcta_label: "Per a grups i professionals",
    home_alqcta_title: "Lloga La Cabanya",
    home_alqcta_desc: "350 m² de sala graner amb vistes a la vall. Ideal per a retirs, esdeveniments, formacions i trobades de fins a 100 persones.",
    home_alqcta_btn: "Veure condicions de lloguer",

    // ── Home — Footer ───────────────────────────────────────────────────────
    footer_desc: "Casa rural a Vidrà, Girona. Un espai segur entre rius i boscos salvatges per a la teva sanació i despertar.",
    footer_contact: "Contacte",
    footer_location: "Vidrà, Girona · Catalunya",
    footer_como_llegar: "Com arribar",
    footer_accesos: "Accessos ràpids",
    footer_retiros: "Retirs",
    footer_talleres: "Tallers",
    footer_reservar: "Reservar",
    footer_rights: "Tots els drets reservats.",

    // ── Alojamiento page ────────────────────────────────────────────────────
    aloj_hero_subtitle: "Tres habitacions úniques entre boscos i rius",
    aloj_rooms_label: "Les habitacions",
    aloj_rooms_title: "Tres deesses que custodien el teu descans",
    aloj_room_artemisa_desc: "2 llits individuals i un llit doble, amb bany. Estufa de pèl·lets. Orientació est.",
    aloj_room_selene_desc: "Habitació amb altell. 2 llits individuals a baix, 2 llits individuals a dalt. Estufa de pèl·lets. Orientació nord.",
    aloj_room_hecate_desc: "2 llits individuals i un llit doble. Estufa de pèl·lets. Orientació oest.",
    aloj_btn_desayuno: "Esmorzar",
    aloj_btn_media_pension: "Mitja Pensió",
    aloj_btn_close: "✕ Tancar",
    aloj_booking_desayuno: "Allotjament + Esmorzar",
    aloj_booking_media_pension: "Allotjament + Mitja Pensió",
    aloj_booking_fecha_label: "Dates",
    aloj_booking_personas_label: "Nombre de persones",
    aloj_booking_max: "màx.",
    aloj_booking_complementos_label: "Complements",
    aloj_booking_contacto_label: "Dades de contacte",
    aloj_booking_nombre_ph: "Nom complet",
    aloj_booking_email_ph: "Correu electrònic",
    aloj_booking_tel_ph: "Telèfon",
    aloj_booking_resumen: "Resum",
    aloj_booking_total: "Total",
    aloj_booking_noches: "nit",
    aloj_booking_noches_pl: "nits",
    aloj_booking_persona: "persona",
    aloj_booking_personas: "persones",
    aloj_booking_por_noche: "per nit",
    aloj_booking_precio_unico: "preu únic",
    aloj_booking_procesando: "Processant...",
    aloj_booking_reservar_pagar: "Reservar i pagar",
    aloj_booking_error_fechas: "Si us plau selecciona les dates d'entrada i sortida.",
    aloj_booking_error_contacto: "Si us plau completa tots els camps de contacte.",
    aloj_cal_entrada: "Selecciona la data d'entrada",
    aloj_cal_salida: "Selecciona la data de sortida",
    aloj_cal_dias: "dia",
    aloj_cal_dias_pl: "dies",

    // ── Cabanya (Alojamiento) ───────────────────────────────────────────────
    aloj_cabanya_label: "Sala exterior",
    aloj_cabanya_title: "La Cabanya · Sala Graner",
    aloj_cabanya_desc: "350 m² de sala amb terra de microciment mirant a la vall. Assolellada a l'hivern i amb ombra a l'estiu. Amb bany, cuina elèctrica, plats, gots i utensilis. Capacitat per a més de 100 persones.",
    aloj_cabanya_price: "10€ per persona · dia",
    aloj_cabanya_consultar: "Consultar disponibilitat",
    aloj_cabanya_fecha_label: "Data de l'esdeveniment",
    aloj_cabanya_personas: "persones",
    aloj_cabanya_total: "Total:",
    aloj_cabanya_btn: "Reservar la Cabanya",
    aloj_cabanya_error_fecha: "Si us plau selecciona una data.",

    // ── Complementos section ────────────────────────────────────────────────
    compl_label: "Enriqueix la teva estada",
    compl_title: "Complements disponibles",
    compl_desc: "Afegeix aquests serveis en fer la teva reserva per a una experiència més completa.",

    // ── Actividades page ────────────────────────────────────────────────────
    act_label: "Natura · Teràpia · Família",
    act_title: "Activitats",
    act_subtitle: "Experiències a la natura i a l'ànima",
    act_contact_fechas: "Contacta'ns per a dates",

    // ── ActividadCard ───────────────────────────────────────────────────────
    act_card_reservar: "Reservar",
    act_card_cerrar: "Tancar",
    act_card_persona: "persona",
    act_card_comida: "Menjar Casolà — 15€",
    act_card_comida_btn: "Reservar Menjar Casolà",
    act_card_comida_label: "Nom complet",
    act_card_email_ph: "Correu electrònic",
    act_card_tel_ph: "Telèfon",
    act_card_personas_label: "Persones",
    act_card_fecha_label: "Selecciona una data",
    act_card_confirmar: "Confirmar reserva",
    act_card_error_fecha: "Si us plau selecciona una data.",
    act_card_cabanya_btn: "Reservar La Cabanya — 10€/persona",
    act_card_cabanya_sala: "Reservar Sala",
    act_card_personas_txt: "persones",
    act_card_error_conexion: "Error de connexió. Torna-ho a intentar.",

    // ── Alquiler page ───────────────────────────────────────────────────────
    alq_cabanya_tipo: "Lloguer d'espai",
    alq_cabanya_title: "La Cabanya · Sala Graner",
    alq_cabanya_price: "10€ per persona · dia",
    alq_cabanya_desc: "350 m² de sala amb terra de microciment mirant a la vall. Amb bany, cuina elèctrica, plats i utensilis. Per a esdeveniments, activitats, menjars familiars... Fins a 100 persones.",
    alq_cabanya_consultar: "Consultar disponibilitat",
    alq_cabanya_fecha_label: "Data de l'esdeveniment",
    alq_cabanya_personas_label: "Nombre de persones",
    alq_cabanya_contacto_label: "Dades de contacte",
    alq_cabanya_nombre_label: "Nom",
    alq_cabanya_email_label: "Email",
    alq_cabanya_tel_label: "Telèfon",
    alq_cabanya_nombre_ph: "El teu nom",
    alq_cabanya_tel_ph: "+34 000 000 000",
    alq_cabanya_error_fecha: "Si us plau selecciona una data.",
    alq_cabanya_error_contacto: "Si us plau completa el nom i l'email.",
    alq_cabanya_reservar: "Reservar La Cabanya",
    alq_casa_tipo: "Casa completa",
    alq_casa_title: "Lloguer Casa per a Retirs",
    alq_casa_price: "80€ per persona · dia",
    alq_casa_desc: "La masia completa per a grups i retirs. Fins a 12 persones. Inclou totes les habitacions, salons, cuina i jardí. Preu basat en persones i dies d'estada.",
    alq_casa_consultar: "Consultar disponibilitat",
    alq_casa_fechas_label: "Dates d'entrada i sortida",
    alq_casa_personas_label: "Nombre de persones",
    alq_casa_50: "50% per reservar",
    alq_casa_contacto_label: "Dades de contacte",
    alq_casa_nombre_label: "Nom",
    alq_casa_email_label: "Email",
    alq_casa_tel_label: "Telèfon",
    alq_casa_nombre_ph: "El teu nom",
    alq_casa_tel_ph: "+34 000 000 000",
    alq_casa_error_fechas: "Si us plau selecciona les dates d'entrada i sortida.",
    alq_casa_error_contacto: "Si us plau completa el nom i l'email.",
    alq_casa_reservar_mitad: "Reservar amb el 50%",
    alq_casa_reservar_total: "Import complet",
    alq_dias: "dies",
    alq_cerrar: "Tancar",

    // ── La Casa page ────────────────────────────────────────────────────────
    lacasa_title: "La Casa",
    lacasa_intro_label: "Espai & Natura",
    lacasa_intro: "La masia pot allotjar fins a 14 persones — 12 participants més 2 facilitadors. Disposa de tres habitacions, sala interior, sala menjador i la gran sala exterior La Cabanya. Envoltada de fagedes, rius salvatges i cascades, és un refugi per al descans i la transformació.",
    lacasa_rooms_label: "Habitacions",
    lacasa_rooms_title: "Tres deesses que custodien el teu descans",
    lacasa_espacios_label: "Espais Comuns",
    lacasa_espacios_title: "Llocs per a la trobada",
    lacasa_cta_label: "Allotjament",
    lacasa_cta_title: "Queda't a dormir",
    lacasa_cta_desc1: "Allotjament + esmorzar — 45€/nit per persona",
    lacasa_cta_desc2: "Allotjament + mitja pensió — 60€/nit per persona",
    lacasa_cta_nota: "La pensió completa s'ofereix únicament als Retirs organitzats. Al migdia pots cuinar a la casa o explorar els voltants — molt recomanable.",
    lacasa_cta_btn: "Consultar disponibilitat",
    lacasa_cta_title2: "Vine a inspirar-te i descansar",

    // ── Habitación names/descriptions (La Casa) ─────────────────────────────
    lacasa_artemisa_nombre: "Habitació Artemisa",
    lacasa_artemisa_desc: "Habitació doble amb vistes al bosc i la muntanya. Anomenada en honor a la deessa de la natura i la lluna, ofereix un refugi íntim entre la pedra original de la masia.",
    lacasa_artemisa_cap: "2 persones",
    lacasa_selene_nombre: "Habitació Selene",
    lacasa_selene_desc: "Habitació doble amb bany privat. Selene, la lluna plena, inspira aquest espai lluminós que banya les seves parets de calç amb la llum suau de cada matí.",
    lacasa_selene_cap: "2 persones",
    lacasa_hecate_nombre: "Habitació Hècate",
    lacasa_hecate_desc: "Habitació triple amb vistes a la vall. Hècate guarda els llindars i els somnis — aquest quart de sostres alts i bigues de fusta convida al descans profund.",
    lacasa_hecate_cap: "3 persones",

    // ── Espacios comunes (La Casa) ──────────────────────────────────────────
    lacasa_sala_interior_nombre: "Sala Interior",
    lacasa_sala_interior_sub: "26 m²",
    lacasa_sala_interior_desc: "Sala multiusos amb terra de ciment polit, parets de calç i bigues de fusta. Perfecta per a ioga, meditació, tallers o cercles de treball en grups reduïts.",
    lacasa_salon_nombre: "Sala Menjador",
    lacasa_salon_sub: "Per a convidats",
    lacasa_salon_desc: "Espai compartit amb taula gran de fusta, cuina equipada i llar de foc de pedra. El lloc on els grups es reuneixen per compartir els àpats i les converses del dia.",
    lacasa_sala_estar_nombre: "Sala d'Estar · Cuina",
    lacasa_sala_estar_sub: "Zona privada",
    lacasa_sala_estar_desc: "Estança amb cuina completa, zona de lectura i accés directe al jardí. Disponible per a grups que llogen la casa completa.",

    // ── Espacios comunes — card Habitaciones ────────────────────────────────
    lacasa_esp_habs_nombre: "Habitacions",
    lacasa_esp_habs_sub: "Tres deesses",
    lacasa_esp_habs_desc: "Tres habitacions úniques de pedra i fusta, cadascuna amb el seu caràcter: Artemisa, Selene i Hècate. Parets de calç, terres antics i llum que entra a poc a poc.",

    // ── Capacidades reales de habitaciones (La Casa page) ───────────────────
    lacasa_artemisa_cap_real: "4 persones",
    lacasa_selene_cap_real: "4 persones",
    lacasa_hecate_cap_real: "4 persones",

    // ── Descripciones reales de habitaciones (La Casa page) ─────────────────
    lacasa_artemisa_desc_real: "Habitació amb llits individuals i llit doble, terra de fusta original, parets de pedra encalçades i llàntia d'espart. Anomenada en honor a la deessa de la natura i la lluna.",
    lacasa_selene_desc_real: "Habitació amb altell. Llits individuals a baix i a dalt, terra de fusta antiga i finestra amb contrafinestretes de fusta. Selene, la lluna plena, inspira aquest espai lluminós.",
    lacasa_hecate_desc_real: "Habitació àmplia amb múltiples llits individuals, estufa de pèl·lets, parets blanques i llum natural generosa. Hècate guarda els llindars i els somnis.",

    // ── Footer mínimo La Casa / Actividades ─────────────────────────────────
    footer_rights_short: "Tots els drets reservats.",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

export const t = translations;

// Helper para usar en componentes
export function getT(lang: Lang) {
  return translations[lang];
}
