import { InputType, Field, Int } from 'type-graphql';
import {
	TicketStatusType,
	TicketPriorityType,
	TicketTypeType,
} from '../entities/Ticket';
import { UserRoleType } from '../entities/User';

//================================================================================
//Comment Input Types
//================================================================================
//// Create Comment ////
@InputType()
export class CreateCommentInput {
	@Field(() => String)
	commentText!: string;
}

//// Find Comment ////
@InputType()
export class FindCommentInput {
	@Field(() => Int)
	commentId!: number;
}

//// Find Comments By Ticket ////
@InputType()
export class FindCommentsByTicketInput {
	@Field(() => Int)
	ticketId!: number;
}

//================================================================================
//Organization Input Types
//================================================================================
//// Create Organization ////
@InputType()
export class CreateOrganizationInput {
	@Field()
	name!: string;
}

//// Change Organization Name ////
@InputType()
export class ChangeOrganizationNameInput {
	@Field()
	name!: string;
}

//================================================================================
//Project Input Types
//================================================================================
//// Create Project ////
@InputType()
export class CreateProjectInput {
	@Field()
	name!: string;
	@Field()
	description!: string;
}

//// Assign Project ////
@InputType()
export class AssignProjectInput {
	@Field(() => Int)
	projectId!: number;
	@Field(() => Int)
	userId!: number;
}

//// Unassign Project ////
@InputType()
export class UnassignProjectInput {
	@Field(() => Int)
	projectId!: number;
	@Field(() => Int)
	userId!: number;
}

//================================================================================
//Ticket Input Types
//================================================================================
//// Create Ticket ////
@InputType()
export class CreateTicketInput {
	@Field(() => Int)
	projectId: number;
	@Field()
	title: string;
	@Field()
	text: string;
}

//// Change Ticket Status ////
@InputType()
export class ChangeTicketStatusInput {
	@Field(() => Int)
	ticketId: number;
	@Field(() => String)
	status!: TicketStatusType;
}

//// Change Ticket Priority ////
@InputType()
export class ChangeTicketPriorityInput {
	@Field(() => Int)
	ticketId: number;
	@Field(() => String)
	priority!: TicketPriorityType;
}

//// Change Ticket Type ////
@InputType()
export class ChangeTicketTypeInput {
	@Field(() => Int)
	ticketId: number;
	@Field(() => String)
	type!: TicketTypeType;
}

//// Assign Ticket ////
@InputType()
export class AssignTicketInput {
	@Field(() => Int)
	ticketId!: number;
	@Field(() => Int)
	userId!: number;
}

//// Find Assigned Tickets By Priority ////
@InputType()
export class FindAssignedTicketsByPriorityInput {
	@Field(() => String)
	priority: TicketPriorityType;
}

//// Find Assigned Tickets By Status ////
@InputType()
export class FindAssignedTicketsByStatusInput {
	@Field(() => String)
	status: TicketStatusType;
}

//// Find Assigned Tickets By Type ////
@InputType()
export class FindAssignedTicketsByTypeInput {
	@Field(() => String)
	type: TicketTypeType;
}

//================================================================================
//User Input Types
//================================================================================
//// Register ////
@InputType()
export class UserRegisterInput {
	@Field()
	firstName!: string;
	@Field()
	lastName!: string;
	@Field()
	email!: string;
	@Field()
	password!: string;
}

//// Login ////
@InputType()
export class UserLoginInput {
	@Field()
	email!: string;
	@Field()
	password!: string;
}

//// Join Organization ////
@InputType()
export class JoinOrganizationInput {
	@Field()
	organizationId: number;
	@Field()
	userId!: number;
}

//// Leave Organization ////
@InputType()
export class LeaveOrganizationInput {
	@Field()
	userId!: number;
}

//// Make Admin ////
@InputType()
export class MakeAdminInput {
	@Field()
	userId!: number;
}

//// Change Role ////
@InputType()
export class ChangeRoleInput {
	@Field()
	userId: number;
	@Field(() => String)
	userRole!: () => UserRoleType;
}

//// Change Password ////
@InputType()
export class ChangePasswordInput {
	@Field()
	newPassword!: string;
	@Field()
	repeatPassword!: string;
}
