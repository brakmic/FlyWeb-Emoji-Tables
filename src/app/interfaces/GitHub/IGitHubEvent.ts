export interface IActor {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
}

export interface IRepo {
    id: number;
    name: string;
    url: string;
}

export interface IAuthor {
    email: string;
    name: string;
}

export interface ICommit {
    sha: string;
    author: IAuthor;
    message: string;
    distinct: boolean;
    url: string;
}

export interface IPayload {
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
    head: string;
    before: string;
    commits: ICommit[];
}
// Represents a single GitHub event defined here: https://developer.github.com/v3/activity/events/
export interface IGitHubEvent {
    id: string;
    type: string;
    public: boolean;
    created_at: string;
    actor: IActor;
    repo: IRepo;
    payload: IPayload;
}
