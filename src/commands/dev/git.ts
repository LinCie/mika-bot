import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { Command, EMBEDTYPE, Mika } from '@/instances'
import { IsOwner } from '@/middlewares'

const data = new SlashCommandBuilder()
    .setName('git')
    .setDescription('Run git command')
    .addStringOption((option) =>
        option
            .setName('command')
            .setDescription('The git command')
            .addChoices(
                { name: 'pull', value: 'pull' },
                { name: 'fetch', value: 'fetch' },
                { name: 'stash', value: 'stash' }
            )
            .setRequired(true)
    )

class GitCommand extends Command {
    constructor() {
        super(data as SlashCommandBuilder)
        this.isGuildOnly = true
        this.use(IsOwner)
    }

    async command(client: Mika, interaction: ChatInputCommandInteraction) {
        const member = interaction.member as GuildMember

        const command = interaction.options.getString('command', true)

        const pm2 = Bun.spawn(['git', ...command.split(' ')])
        const code = await pm2.exited

        if (code === 0) {
            const embed = client.embed.createMessageEmbedWithAuthor(
                `Ran command \`\`\`bash\ngit ${command}\n\`\`\``,
                member,
                EMBEDTYPE.SUCCESS
            )
            await client.interaction.replyEmbed(interaction, embed)
        } else {
            const embed = client.embed.createMessageEmbedWithAuthor(
                `An error occured when running command \`\`\`bash\ngit ${command}\n\`\`\`\nError code: ${code}`,
                member,
                EMBEDTYPE.ERROR
            )
            await client.interaction.replyEmbed(interaction, embed)
        }
    }
}

export default GitCommand
