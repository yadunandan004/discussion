export function addAllTopics(result)
{
	return {type:'ADD_TOPICS',payload:result};
}
export function pickTopic(topic)
{
	return {type:'SELECT_TOPIC',payload:{selectedTopic:topic}};
}
export function sendMessage(msg)
{
	return{type:'SEND_MESSAGE',payload:msg};
}
export function removeSelectedTopic()
{
	return {type:'CLEAR_TOPICS'};
}

export function updateUsers(userlist)
{
	return {type:'UPDATE_USERS',payload:userlist};
}
export function addNews(news)
{
	return {type:'UPDATE_NEWS',payload:{news:news}};
}