import {createLocalVue, shallowMount} from "@vue/test-utils";
import Counter from "@/Counter";
import Vuex from 'vuex'
import {state, getters, actions, mutations} from "@/store";

function mountComponent(Component) {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return shallowMount(Component, {
        localVue,
        store: new Vuex.Store({
            state,
            getters,
            actions,
            mutations
        })
    });
}

describe('Counter.vue', () => {
    describe("exists check", () => {

        let wrapper
        beforeEach(() => {
            wrapper = mountComponent(Counter)
        })

        it("should component exists", () => {
            expect(wrapper.exists()).toBeTruthy()
        })

        it("should increase button exists", () => {
            const button = wrapper.findAll("button").filter(button => button.text().match("Increase"));
            expect(button.exists()).toBeTruthy()
        })

        it("should decrease button exists", () => {
            const button = wrapper.findAll("button").filter(button => button.text().match("Decrease"));
            expect(button.exists()).toBeTruthy()
        })

    })

    describe('functionality check', () => {
        let wrapper
        beforeEach(() => {
            wrapper = mountComponent(Counter)
        })

        // Clear count value after each test to prevent from value that increased before
        // If there was too many values, localVue is not useful.
        afterEach(() => {
            state.count = 0
        });

        it("should increase count when increase button clicked", async () => {
            const button = wrapper.findAll("button").filter(button => button.text().match("Increase"));
            await button.trigger('click')
            expect(state.count).toBe(1)
        })

        it("should decrease count when increase button clicked", async () => {
            const button = wrapper.findAll("button").filter(button => button.text().match("Decrease"));
            await button.trigger('click')
            expect(state.count).toBe(-1)
        })

        it("should 2 increase 1 decrease together", async () => {
            const decreaseButton = wrapper.findAll("button").filter(button => button.text().match("Decrease"));
            const increaseButton = wrapper.findAll("button").filter(button => button.text().match("Increase"));

            await increaseButton.trigger('click')
            await increaseButton.trigger('click')
            expect(state.count).toBe(2)

            await decreaseButton.trigger('click')
            expect(state.count).toBe(1)

        })

        it("should render count text correctly", () => {
            const countText = wrapper.find("span");
            expect(countText.exists()).toBeTruthy();
            expect(countText.text()).toBe(state.count + "k")
        })
    });
});
