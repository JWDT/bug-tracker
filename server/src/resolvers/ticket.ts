import {
	Arg,
	Ctx,
	Field,
	InputType,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Project } from '../entities/Project';
import { Ticket, TicketStatusType } from '../entities/Ticket';
import { User } from '../entities/User';
import { isSubmitter } from '../middleware/isSubmitter';
import { MyContext } from '../types';

@ObjectType()
class TicketFieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class TicketResponse {
	@Field(() => [TicketFieldError], { nullable: true })
	errors?: TicketFieldError[];

	@Field(() => Ticket, { nullable: true })
	ticket?: Ticket;
}

//================================================================================
//Inputs
//================================================================================
@InputType()
export class CreateTicketInput {
	@Field(() => Int)
	projectId: number;
	@Field()
	title: string;
	@Field()
	text: string;
}

@InputType()
export class ChangeTicketStatusInput {
	@Field(() => Int)
	ticketId: number;
	@Field(() => String)
	status!: TicketStatusType;
}

//// CR ////
@Resolver(Ticket)
export class TicketResolver {
	//================================================================================
	//Create Ticket
	//================================================================================
	@Mutation(() => TicketResponse)
	@UseMiddleware(isSubmitter)
	async createTicket(
		@Arg('options') options: CreateTicketInput,
		@Ctx() { req }: MyContext
	): Promise<TicketResponse> {
		const isUser = await User.findOne(req.session.UserId);
		const isProject = await Project.findOne(options.projectId);
		if (!isProject) {
			return {
				errors: [
					{
						field: 'project',
						message: 'failed to find a project with that id.',
					},
				],
			};
		}
		if (isUser?.role === 'submitter') {
			if (isUser.assignedProjectsId !== isProject?.id) {
				return {
					errors: [
						{
							field: 'user',
							message: 'this user is not assigned to this project.',
						},
					],
				};
			}
		}
		if (isUser?.role === 'projectManager') {
			if (isUser.assignedProjectsId !== isProject?.id) {
				return {
					errors: [
						{
							field: 'user',
							message: 'this user is not assigned to this project.',
						},
					],
				};
			}
		}
		let ticket;
		try {
			const result = await getConnection()
				.createQueryBuilder()
				.insert()
				.into(Ticket)
				.values({
					title: options.title,
					text: options.text,
					creatorId: req.session.UserId,
					projectId: isProject?.id,
				})
				.returning('*')
				.execute();

			ticket = result.raw[0];
		} catch (err) {
			console.error(err);
		}
		return { ticket };
	}

	//================================================================================
	//Find Ticket Query
	//================================================================================
	@Query(() => Ticket, { nullable: true })
	findTicket(@Arg('id', () => Int) id: number): Promise<Ticket | undefined> {
		return Ticket.findOne(id, { relations: ['assignedDeveloper', 'project'] });
	}
	//================================================================================
	//Change Ticket Status
	//================================================================================
	@Mutation(() => TicketResponse)
	async changeTicketStatus(
		@Arg('options') options: ChangeTicketStatusInput,
		@Ctx() { req }: MyContext
	): Promise<TicketResponse> {
		// const isTicket = await Ticket.findOne(options.ticketId);
		const isUser = await User.findOne(req.session.UserId);
		if (!isUser) {
			return {
				errors: [
					{
						field: 'user',
						message: 'no user is logged in.',
					},
				],
			};
		}
		await Ticket.update({ id: options.ticketId }, { status: options.status });
		const ticket = await Ticket.findOne(options.ticketId);
		return { ticket };
	}
}