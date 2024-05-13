import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

//Prompt Templates
const template = "You are a director of social media with 30 years of experience. Please give me some ideas for content I should"
                 + " write about regarding {topic}? The content is for {socialplatform}. Translate to {language}";

const prompt = new PromptTemplate ({
    template: template,
    inputVariables: ["topic", "socialplatform", "language"],
});

// const formattedPromptTemplate = await prompt.format({
//     topic: "artificial intelligence",
//     socialplatform: "twitter",
//     language: "spanish",
// });

// console.log({formattedPromptTemplate});

//LLM chain - 1. Creates prompt templates 2. Call to OpenAI
//0=not creative, 1=very creative
// const model = new OpenAI({
//     temperature: 0.9, 
//     modelName: "gpt-3.5-turbo"
// });

// const chain = new LLMChain({prompt: prompt, llm: model});

// const resChain = await chain.call({
//     topic: "artificial intelligence",
//     socialplatform: "twitter",
//     language: "english",
// });

// console.log({ resChain });

// const agentModel = new OpenAI({
//     temperature: 0.9, 
//     modelName: "gpt-3.5-turbo"
// });

const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
        location: "Dallas, Texas, United States",
        hl: "en",
        gl: "us",
    }),
    new Calculator(),
];

// const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
//     agentType: "zero-shot-react-description",
//     verbose: true,
//     maxIterations: 5,
// });

// const input = "What is langchain?";

// const result = await executor.call({input});

// console.log({result});

//Plan and action agent
// const chatModel = new OpenAI({
//     temperature: 0, 
//     modelName: "gpt-3.5-turbo",
//     verbose: true,
// });

// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//     llm: chatModel,
//     tools: tools,
// });

// const result = await executor.call({
//     input: "Who is the current president of Unites States? What is their current age raised to the second power?"
// });

// console.log({result});

//Memory
const llm = new OpenAI({modelName: "davinci-002"});
const memory = new BufferMemory();
const conversationChain = new ConversationChain({ llm: llm, memory: memory});

const res1 = conversationChain.call({
    input: "Hey, my name is Vaibhavkumar Joshi."
});

console.log({res1});

const input = "What is my name?"
const res2 = conversationChain.call({
    input: input
});

console.log(input);
console.log({res2});
