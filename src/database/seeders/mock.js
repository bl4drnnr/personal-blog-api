/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, sequelize) {
    try {
      await queryInterface.bulkInsert('users', [
        {
          id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          email: 'ryan.gosling@drive.com',
          // Password: 12qw!@QW
          password: '$2a$10$1HvnaYFhmlKAT/kmpA2rDOu3jSXqzRoBsbeFUrHLQoqKQgl8lsUba',
          first_name: 'Ryan',
          last_name: 'Gosling',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('confirmation_hashes', [
        {
          id: 'd1486e56-88fc-4774-9c28-48a1b70e6f8b',
          confirmation_hash: '7a860d74af63e0fab36585e8fea66e5693017448',
          confirmed: true,
          confirmation: 'REGISTRATION',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('users_settings', [
        {
          id: 'da334f15-2ce1-4a00-b8cc-6ed9204860d2',
          two_fa_token: 'MNKFQUP6S77VONDE47A3B6VMFEPKVD5X',
          password_changed: null,
          recovery_keys_fingerprint: 'f98987f041451623cccef2992a04f733078640120c7ea00f48e5ca12fe65d74c4bee8a69c248366544784b10a2aafa51efceea1c191a5a9a6878c9e7e44eca46',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('categories', [
        {
          id: 'b20808d8-cc5a-4762-8a2a-f40016bb09db',
          category_name: 'Cybersecurity',
          category_description: 'In today\'s digital age, protecting sensitive information and safeguarding online activities is more important than ever. Our Cybersecurity category is dedicated to providing insights, news, and practical tips on how to stay secure in the fast-evolving digital world. Whether you\'re a business owner, IT professional, or an everyday internet user, this space will cover topics ranging from the latest cyber threats and data breaches to security best practices, encryption techniques, and emerging technologies like AI in cybersecurity. Stay informed, stay protected, and learn how to build a strong defense against cyber risks.\n',
          category_language: 'en',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'b47b575f-4aa4-418d-a7d2-bf4f77773468',
          category_name: 'Cyberbezpieczeństwo',
          category_description: 'W dzisiejszej erze cyfrowej ochrona poufnych informacji i zabezpieczanie aktywności online jest ważniejsze niż kiedykolwiek. Nasza kategoria Cyberbezpieczeństwo jest poświęcona dostarczaniu spostrzeżeń, wiadomości i praktycznych wskazówek, jak zachować bezpieczeństwo w szybko ewoluującym świecie cyfrowym. Niezależnie od tego, czy jesteś właścicielem firmy, specjalistą IT, czy codziennym użytkownikiem Internetu, ta przestrzeń obejmie tematy od najnowszych cyberzagrożeń i naruszeń danych po najlepsze praktyki bezpieczeństwa, techniki szyfrowania i nowe technologie, takie jak sztuczna inteligencja w cyberbezpieczeństwie. Bądź na bieżąco, zachowaj ochronę i dowiedz się, jak zbudować silną obronę przed cyberzagrożeniami.',
          category_language: 'pl',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '51eaea12-98fc-4a75-a84c-39ebd42a5b95',
          category_name: 'Кибербезопасность',
          category_description: 'В сегодняшнюю цифровую эпоху защита конфиденциальной информации и обеспечение безопасности онлайн-активности важнее, чем когда-либо. Наша категория «Кибербезопасность» посвящена предоставлению информации, новостей и практических советов о том, как оставаться в безопасности в быстро меняющемся цифровом мире. Независимо от того, являетесь ли вы владельцем бизнеса, ИТ-специалистом или обычным пользователем Интернета, в этом пространстве будут рассмотрены темы, начиная от последних киберугроз и утечек данных до лучших практик безопасности, методов шифрования и новых технологий, таких как ИИ в кибербезопасности. Будьте в курсе, оставайтесь защищенными и узнайте, как создать надежную защиту от киберрисков.',
          category_language: 'ru',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e0a8c5d3-6f84-4369-9280-47324a149099',
          category_name: 'News',
          category_description: 'Stay up to date with the latest developments and breaking stories from around the world in our News category. We bring you timely updates on a wide range of topics, including global events, technology advancements, business trends, political shifts, and cultural happenings. Whether you\'re looking for in-depth analysis, expert opinions, or quick headlines, this section delivers everything you need to stay informed in an ever-changing world. Our commitment is to provide accurate, insightful, and unbiased reporting that keeps you connected to the news that matters most.\n',
          category_language: 'en',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '6c7184d1-3634-46b2-b1dc-f025865fb01e',
          category_name: 'Wiadomości',
          category_description: 'Bądź na bieżąco z najnowszymi wydarzeniami i najnowszymi historiami z całego świata w naszej kategorii Wiadomości. Dostarczamy Ci aktualne informacje na szeroki zakres tematów, w tym wydarzenia globalne, postęp technologiczny, trendy biznesowe, zmiany polityczne i wydarzenia kulturalne. Niezależnie od tego, czy szukasz dogłębnej analizy, opinii ekspertów czy szybkich nagłówków, ta sekcja dostarcza wszystkiego, czego potrzebujesz, aby być na bieżąco w ciągle zmieniającym się świecie. Naszym zobowiązaniem jest dostarczanie dokładnych, wnikliwych i bezstronnych relacji, które pozwolą Ci być na bieżąco z najważniejszymi wiadomościami.',
          category_language: 'pl',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3f69170c-8f03-4820-b311-3d41441b54d1',
          category_name: 'Новости',
          category_description: 'Оставайтесь в курсе последних событий и новостей со всего мира в нашей категории новостей. Мы предоставляем вам своевременные обновления по широкому кругу тем, включая мировые события, технологические достижения, бизнес-тенденции, политические сдвиги и культурные события. Если вы ищете глубокий анализ, экспертные мнения или быстрые заголовки, этот раздел предоставляет все, что вам нужно, чтобы оставаться в курсе событий в постоянно меняющемся мире. Наша цель — предоставлять точные, проницательные и беспристрастные репортажи, которые позволят вам оставаться в курсе самых важных новостей.',
          category_language: 'ru',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '0d37f12a-e21d-4017-9d2b-3c1727abb318',
          category_name: 'Networking',
          category_description: 'In the increasingly interconnected world of technology, networking plays a crucial role in enabling communication, data exchange, and collaboration. Our Networking category explores everything from the fundamentals of network architecture to the latest trends in wireless technologies, cloud networking, and IoT connectivity. Whether you\'re an IT professional, a network engineer, or a tech enthusiast, this space offers insights into network security, infrastructure design, protocols, troubleshooting, and the future of 5G and beyond. Stay ahead with expert tips, tutorials, and the latest industry news in the world of networking.\n',
          category_language: 'en',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'dd4f101e-6b4a-494a-84b4-5a98c65aa652',
          category_name: 'Sieci',
          category_description: 'W coraz bardziej połączonym świecie technologii sieci odgrywają kluczową rolę w umożliwianiu komunikacji, wymiany danych i współpracy. Nasza kategoria Sieci obejmuje wszystko, od podstaw architektury sieciowej po najnowsze trendy w technologiach bezprzewodowych, sieciach w chmurze i łączności IoT. Niezależnie od tego, czy jesteś profesjonalistą IT, inżynierem sieciowym czy entuzjastą technologii, ta przestrzeń oferuje wgląd w bezpieczeństwo sieci, projektowanie infrastruktury, protokoły, rozwiązywanie problemów oraz przyszłość 5G i nie tylko. Bądź na bieżąco dzięki poradom ekspertów, samouczkom i najnowszym wiadomościom branżowym ze świata sieci.',
          category_language: 'pl',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '237dbcd8-1c48-4c31-829f-50e8fd5d15c2',
          category_name: 'Сети',
          category_description: 'В мире технологий, который становится все более взаимосвязанным, сетевые технологии играют решающую роль в обеспечении связи, обмена данными и совместной работы. Наша категория «Сетевые технологии» исследует все: от основ сетевой архитектуры до последних тенденций в беспроводных технологиях, облачных сетях и подключении к Интернету вещей. Независимо от того, являетесь ли вы ИТ-специалистом, сетевым инженером или энтузиастом технологий, это пространство предлагает идеи по сетевой безопасности, проектированию инфраструктуры, протоколам, устранению неполадок и будущему 5G и далее. Будьте в курсе событий с помощью советов экспертов, учебных пособий и последних новостей отрасли в мире сетей.',
          category_language: 'ru',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('authors', [
        {
          id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          first_name: 'Mikhail',
          last_name: 'Bahdashych',
          title: 'Cybersecurity Officer / Chief Author',
          description: 'Poland-based ex full-stack financial technologies/crypto web developer. Currently doing cybersecurity. Holding the bachelor degree in Software Engineering at UITM (University of Information Technology and Management) in Rzeszow, Poland. Improving skills at not only web development, but mostly at cybersecurity along with Artificial Intelligence and Machine Learning.',
          profile_picture: 'literally-me.jpeg',
          is_selected: true,
          author_language: 'en',
          author_common_id: 'cf73c629-fc39-4ae6-b4ca-7ab5f3bff65b',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          first_name: 'Michał',
          last_name: 'Bahdashych',
          title: 'Specjalista ds. cyberbezpieczeństwa / Główny autor',
          description: 'Były programista full-stack financial technologies/crypto web developer z siedzibą w Polsce. Obecnie zajmuje się cyberbezpieczeństwem. Posiada tytuł licencjata z inżynierii oprogramowania na UITM (Wyższej Szkole Informatyki i Zarządzania) w Rzeszowie, Polska. Doskonalenie umiejętności nie tylko w zakresie tworzenia stron internetowych, ale przede wszystkim w zakresie cyberbezpieczeństwa wraz ze sztuczną inteligencją i uczeniem maszynowym.',
          profile_picture: 'literally-me.jpeg',
          is_selected: true,
          author_language: 'pl',
          author_common_id: 'cf73c629-fc39-4ae6-b4ca-7ab5f3bff65b',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          first_name: 'Михаил',
          last_name: 'Богдашич',
          title: 'Сотрудник по кибербезопасности / Главный автор',
          description: 'Бывший веб-разработчик full-stack финансовых технологий/криптовалюты из Польши. В настоящее время занимаюсь кибербезопасностью. Имеет степень бакалавра по программной инженерии в UITM (Университет информационных технологий и менеджмента) в Жешуве, Польша. Совершенствую навыки не только в веб-разработке, но и в кибербезопасности, а также в области искусственного интеллекта и машинного обучения.',
          profile_picture: 'literally-me.jpeg',
          is_selected: true,
          author_language: 'ru',
          author_common_id: 'cf73c629-fc39-4ae6-b4ca-7ab5f3bff65b',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('certificates', [
        {
          id: 'f2cbe13b-2fcc-46f2-8081-b07a23fcb818',
          cert_name: 'CCNA',
          cert_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna.jpg',
          cert_docs: 'ccna.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'en',
          cert_common_id: '6c058a14-abf3-4e1b-acae-7833daaf724f',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '60f9956d-5af4-40aa-af9c-f7890e20cc87',
          cert_name: 'CCNAv7: ENSA',
          cert_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_ensa.png',
          cert_docs: 'ccna_ensa.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'en',
          cert_common_id: '8badd29b-7f02-4a80-90fd-4dfead56acee',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '2cda5c60-e449-46e2-bbf6-987562666b6f',
          cert_name: 'CCNAv7: SRWE',
          cert_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_srwe.png',
          cert_docs: 'ccna_srwe.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'en',
          cert_common_id: '84c8630e-b37e-4d73-88b8-c4332d3c62d7',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '42048156-03b0-4729-bd63-46b535457fd1',
          cert_name: 'CompTIA Security+',
          cert_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'comptia-sec-certification.png',
          cert_docs: 'comptia-sec-certification.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'en',
          cert_common_id: 'b0f0acbe-a9e8-4e14-b9c9-5490bff648ff',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'a5c59d7b-029e-41ec-85e5-4daad52999dc',
          cert_name: 'CCNA',
          cert_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna.jpg',
          cert_docs: 'ccna.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'ru',
          cert_common_id: '6c058a14-abf3-4e1b-acae-7833daaf724f',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'b1df86af-2e8c-4c90-ac8a-0520e0e197b4',
          cert_name: 'CCNAv7: ENSA',
          cert_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_ensa.png',
          cert_docs: 'ccna_ensa.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'ru',
          cert_common_id: '8badd29b-7f02-4a80-90fd-4dfead56acee',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '56109859-70d5-44e2-bf01-2158cd5908c5',
          cert_name: 'CCNAv7: SRWE',
          cert_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_srwe.png',
          cert_docs: 'ccna_srwe.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'ru',
          cert_common_id: '84c8630e-b37e-4d73-88b8-c4332d3c62d7',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'be9904b2-a443-464f-aa95-5656991438c6',
          cert_name: 'CompTIA Security+',
          cert_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'comptia-sec-certification.png',
          cert_docs: 'comptia-sec-certification.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'ru',
          cert_common_id: 'b0f0acbe-a9e8-4e14-b9c9-5490bff648ff',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'b3e01b23-7465-43a6-aa0a-62819a85c56e',
          cert_name: 'CCNA',
          cert_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna.jpg',
          cert_docs: 'ccna.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'pl',
          cert_common_id: '6c058a14-abf3-4e1b-acae-7833daaf724f',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'd21bd3de-f376-4a9b-b7b3-cad896f4fe0d',
          cert_name: 'CCNAv7: ENSA',
          cert_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_ensa.png',
          cert_docs: 'ccna_ensa.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'pl',
          cert_common_id: '8badd29b-7f02-4a80-90fd-4dfead56acee',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '47e410e7-1346-494d-bafd-dde43219ae28',
          cert_name: 'CCNAv7: SRWE',
          cert_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'ccna_srwe.png',
          cert_docs: 'ccna_srwe.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'pl',
          cert_common_id: '84c8630e-b37e-4d73-88b8-c4332d3c62d7',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'fd5e73d8-fc7f-448a-abfe-e46312660c4e',
          cert_name: 'CompTIA Security+',
          cert_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta iste minus quis sit! Distinctio doloremque eveniet expedita facilis magnam, mollitia numquam voluptate. Adipisci beatae, fugit harum ipsam quam quod sit.',
          cert_picture: 'comptia-sec-certification.png',
          cert_docs: 'comptia-sec-certification.pdf',
          obtaining_date: new Date(),
          expiration_date: new Date(),
          obtained_skills: ['Networking', 'Security', 'Cisco'],
          is_selected: true,
          cert_language: 'pl',
          cert_common_id: 'b0f0acbe-a9e8-4e14-b9c9-5490bff648ff',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        }
      ]);

      await queryInterface.bulkInsert('socials', [
        {
          id: '51452fdf-64ae-49e1-95a6-7fe24ebc9e07',
          link: 'www.linkedin.com/in/mikhail-bahdashych',
          title: 'LI.',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '78a363c2-f8f4-4e0a-b856-813effa84664',
          link: 'stackoverflow.com/users/16732680/dokichan',
          title: 'SO.',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'c7bf4552-8f51-4895-8325-153cbdd82a3f',
          link: 'www.linkedin.com/in/mikhail-bahdashych',
          title: 'LI.',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'c6018079-7070-47c3-b40e-267f736a03dc',
          link: 'stackoverflow.com/users/16732680/dokichan',
          title: 'SO.',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: 'e6106f9d-7166-4c00-9d63-0791cd1f554c',
          link: 'www.linkedin.com/in/mikhail-bahdashych',
          title: 'LI.',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        },
        {
          id: '74c5db3e-8459-46f2-b8f2-14ee26b5469f',
          link: 'stackoverflow.com/users/16732680/dokichan',
          title: 'SO.',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date,
          updated_at: new Date
        }
      ]);

      await queryInterface.bulkInsert('experiences', [
        {
          id: 'ce48511d-aeaa-4437-8005-b61dca5d928a',
          company_name: 'Cryptovoucher / P100',
          company_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'cryptovoucher.io',
          company_link_title: 'Cryptovoucher Official Website',
          company_picture: 'cv.jpeg',
          obtained_skills: ['Assets management', 'Users management', 'Cybersecurity management'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'en',
          experience_common_id: 'faff454c-1139-400f-b432-ef46c9f6b3db',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '93187a57-e8ab-4b05-9013-eec33e389239',
          company_name: 'Knowde',
          company_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'knowde.com',
          company_link_title: 'Knowde Official Website',
          company_picture: 'knowde.webp',
          obtained_skills: ['Web development', 'Anti-money laundering', 'AWS'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'en',
          experience_common_id: '0bef5296-5310-425f-a195-404bf770035f',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '4995d9f5-166f-4d20-8f59-b207ae68c59f',
          company_name: 'Cryptovoucher / P100',
          company_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'cryptovoucher.io',
          company_link_title: 'Cryptovoucher Official Website',
          company_picture: 'cv.jpeg',
          obtained_skills: ['Assets management', 'Users management', 'Cybersecurity management'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'pl',
          experience_common_id: 'faff454c-1139-400f-b432-ef46c9f6b3db',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '5ac4dc4c-c8b3-4769-bdf9-8dc7d5931676',
          company_name: 'Knowde',
          company_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'knowde.com',
          company_link_title: 'Knowde Official Website',
          company_picture: 'knowde.webp',
          obtained_skills: ['Web development', 'Anti-money laundering', 'AWS'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'pl',
          experience_common_id: '0bef5296-5310-425f-a195-404bf770035f',
          author_id: '56932d76-0dbc-4426-a8dc-98c7378a432f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '31b4242f-8741-4d78-9806-9ad989573973',
          company_name: 'Cryptovoucher / P100',
          company_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'cryptovoucher.io',
          company_link_title: 'Cryptovoucher Official Website',
          company_picture: 'cv.jpeg',
          obtained_skills: ['Assets management', 'Users management', 'Cybersecurity management'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'ru',
          experience_common_id: 'faff454c-1139-400f-b432-ef46c9f6b3db',
          author_id: '263d6d5a-8690-476a-9dad-da9d0cc1b61f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '40e62a56-7cf5-4ce6-83f0-0f5b9bdd99a8',
          company_name: 'Knowde',
          company_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
          company_link: 'knowde.com',
          company_link_title: 'Knowde Official Website',
          company_picture: 'knowde.webp',
          obtained_skills: ['Web development', 'Anti-money laundering', 'AWS'],
          start_date: new Date(),
          end_date: new Date(),
          is_selected: true,
          experience_language: 'ru',
          experience_common_id: '0bef5296-5310-425f-a195-404bf770035f',
          author_id: 'a4cb9312-3430-44b2-abcd-b6821a864e37',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('experience_positions', [
        {
          id: '0d90be89-f748-4003-bff7-7190509bddef',
          position_title: 'Full Stack Web Developer',
          position_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'en',
          position_common_id: '93823178-c3f9-4acf-ac7d-f41d64809a63',
          experience_id: 'ce48511d-aeaa-4437-8005-b61dca5d928a',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'fc2ef3e8-c21c-499e-af57-a8584927c1ee',
          position_title: 'Jr Security Operations Specialist',
          position_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'en',
          position_common_id: 'b051b110-596e-4a7e-ab82-6aa631a68974',
          experience_id: 'ce48511d-aeaa-4437-8005-b61dca5d928a',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '32cae7e1-a3ce-4c2f-a74d-fa4f5c140faa',
          position_title: 'Middle Security Operations Specialist',
          position_description: 'EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'en',
          position_common_id: 'd2848268-3225-45a8-80c9-aa4614db0727',
          experience_id: '93187a57-e8ab-4b05-9013-eec33e389239',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'd4c737ca-c90f-42a9-a7f1-91b4a2eee574',
          position_title: 'Full Stack Web Developer',
          position_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'pl',
          position_common_id: '93823178-c3f9-4acf-ac7d-f41d64809a63',
          experience_id: '4995d9f5-166f-4d20-8f59-b207ae68c59f',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e53703bc-7fe7-4fef-bb96-90b02ac27c58',
          position_title: 'Jr Security Operations Specialist',
          position_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'pl',
          position_common_id: 'b051b110-596e-4a7e-ab82-6aa631a68974',
          experience_id: '5ac4dc4c-c8b3-4769-bdf9-8dc7d5931676',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '20128c3a-040a-4a0c-8d64-53db5eadfe46',
          position_title: 'Middle Security Operations Specialist',
          position_description: 'PL Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'pl',
          position_common_id: 'd2848268-3225-45a8-80c9-aa4614db0727',
          experience_id: '5ac4dc4c-c8b3-4769-bdf9-8dc7d5931676',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '8cb0cf56-9582-4ae8-aa6e-014118aea57d',
          position_title: 'Full Stack Web Developer',
          position_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'ru',
          position_common_id: '93823178-c3f9-4acf-ac7d-f41d64809a63',
          experience_id: '31b4242f-8741-4d78-9806-9ad989573973',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '353f5770-d499-461a-802b-a40d4270f165',
          position_title: 'Jr Security Operations Specialist',
          position_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'ru',
          position_common_id: 'b051b110-596e-4a7e-ab82-6aa631a68974',
          experience_id: '40e62a56-7cf5-4ce6-83f0-0f5b9bdd99a8',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'b83bc1c8-df0e-4191-ad8a-93a62e6b63cb',
          position_title: 'Middle Security Operations Specialist',
          position_description: 'RU Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dignissimos officia possimus rem sapiente sit?',
          position_start_date: new Date(),
          position_end_date: new Date(),
          position_language: 'ru',
          position_common_id: 'd2848268-3225-45a8-80c9-aa4614db0727',
          experience_id: '40e62a56-7cf5-4ce6-83f0-0f5b9bdd99a8',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (e) {
      console.log('Error while creating seeders: ', e);
    }
  },

  async down(queryInterface, sequelize) {
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
    await queryInterface.bulkDelete('confirmation_hashes', null, {});
    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.bulkDelete('categories', null, {});

    await queryInterface.bulkDelete('experience_positions', null, {});
    await queryInterface.bulkDelete('experiences', null, {});

    await queryInterface.bulkDelete('socials', null, {});
    await queryInterface.bulkDelete('certificates', null, {});
  },
};
