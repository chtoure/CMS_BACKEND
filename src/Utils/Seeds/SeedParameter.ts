import prisma from "../../Utils/PrismaClient.ts";

async function seedAddParameter() {
    console.log('Début du peuplement des paramètres...');

    const parameter = await prisma.parameter.upsert({
        where: { id: 1 },
        update: {}, // Si les paramètres existent déjà, on ne touche à rien
        create: {
            id: 1,
            entity_name: 'Compositor Enterprise',
            title: 'Mon Super CMS Compositor',
            logo: 'media/defaults/logo-placeholder.png', // Chemin par défaut
            description: 'Bienvenue sur votre nouveau CMS sur-mesure. Commencez à composer vos pages dès maintenant.',
        },
    });

    console.log({ parameter });
    console.log('Paramètres initiaux créés avec succès !');
}


export { seedAddParameter };
