import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import App from "@/App";
import {actions, getters, mutations, state} from "@/store";

describe('App.vue', () => {
    describe("exists check", () => {

        let wrapper
        beforeEach(() => {
            wrapper = mountComponent(App)
        })

        it("should component exists", () => {
            expect(wrapper.exists()).toBeTruthy()
        })

        it("should h1 exists", () => {
            const h1 = wrapper.find("h1");
            expect(h1.exists()).toBeTruthy()
        })

        it("should h1 contains 'Daily Corona Cases in Turkey'", () => {
            const h1 = wrapper.find("h1");
            expect(h1.text()).toBe('Daily Corona Cases in Turkey')
        })

    })

    describe("should notificationArea class change based on getCount value", () => {

        const testCases = [
            {
                testCaseName: 'when daily cases are normal',
                getCount: 7,
                backgroundColor: 'gray',
                expectedClass: 'normal',
                message: 'Life is normal. Case count is 7k'
            },
            {
                testCaseName: 'when daily cases are dangerous',
                getCount: 11,
                backgroundColor: 'red',
                expectedClass: 'danger',
                message: 'Danger!!! Case count is 11k'
            },
            {
                testCaseName: 'when daily cases are safe',
                getCount: 4,
                backgroundColor: 'green',
                expectedClass: 'safe',
                message: 'So safe. Case count is 4k'
            }
        ]
        for (let testCase of testCases) {
            test(testCase.testCaseName, () => {
                const wrapper = shallowMount(App, {
                    mocks: {
                        $store: {
                            state: {
                                count: testCase.getCount
                            },
                            getters: {
                                getCount: testCase.getCount
                            }
                        }
                    }
                })
                const notificationArea = wrapper.find('.notificationArea');
                expect(notificationArea.isVisible()).toBeTruthy()
                expect(notificationArea.classes()).toContain(testCase.expectedClass)
                expect(notificationArea.text()).toBe(testCase.message)
                //this will fail because JSDOM doesn't fully support CSS variables
                //expect(getComputedStyle(notificationArea.element).getPropertyValue('background-color')).toBe(testCase.backgroundColor)
            })
        }
    })
});

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
