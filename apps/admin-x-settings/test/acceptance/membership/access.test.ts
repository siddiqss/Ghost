import {chooseOptionInSelect, globalDataRequests, mockApi, responseFixtures, updatedSettingsResponse} from '../../utils/acceptance';
import {expect, test} from '@playwright/test';

test.describe('Access settings', async () => {
    test('Supports editing access', async ({page}) => {
        const {lastApiRequests} = await mockApi({page, requests: {
            ...globalDataRequests,
            editSettings: {method: 'PUT', path: '/settings/', response: updatedSettingsResponse([
                {key: 'default_content_visibility', value: 'members'},
                {key: 'members_signup_access', value: 'invite'},
                {key: 'comments_enabled', value: 'all'}
            ])}
        }});

        await page.goto('/');

        const section = page.getByTestId('access');

        await expect(section.getByText('Anyone can sign up')).toHaveCount(1);
        await expect(section.getByText('Public')).toHaveCount(1);
        await expect(section.getByText('Nobody')).toHaveCount(1);

        await section.getByRole('button', {name: 'Edit'}).click();

        await chooseOptionInSelect(section.getByTestId('subscription-access-select'), 'Only people I invite');
        await chooseOptionInSelect(section.getByTestId('default-post-access-select'), /^Members only$/);
        await chooseOptionInSelect(section.getByTestId('commenting-select'), 'All members');

        await section.getByRole('button', {name: 'Save'}).click();

        await expect(section.getByTestId('subscription-access-select')).toHaveCount(0);

        await expect(section.getByText('Only people I invite')).toHaveCount(1);
        await expect(section.getByText('Members only')).toHaveCount(1);
        await expect(section.getByText('All members')).toHaveCount(1);

        expect(lastApiRequests.editSettings?.body).toEqual({
            settings: [
                {key: 'default_content_visibility', value: 'members'},
                {key: 'members_signup_access', value: 'invite'},
                {key: 'comments_enabled', value: 'all'}
            ]
        });
    });

    test('Supports selecting specific tiers', async ({page}) => {
        const {lastApiRequests} = await mockApi({page, requests: {
            ...globalDataRequests,
            browseTiers: {method: 'GET', path: '/tiers/', response: responseFixtures.tiers},
            editSettings: {method: 'PUT', path: '/settings/', response: updatedSettingsResponse([
                {key: 'default_content_visibility', value: 'tiers'},
                {key: 'default_content_visibility_tiers', value: JSON.stringify(responseFixtures.tiers.tiers.map(tier => tier.id))}
            ])}
        }});

        await page.goto('/');

        const section = page.getByTestId('access');

        await section.getByRole('button', {name: 'Edit'}).click();

        await chooseOptionInSelect(section.getByTestId('default-post-access-select'), 'Specific tiers');
        await section.getByTestId('tiers-select').click();

        await section.locator('[data-testid="select-option"]', {hasText: 'Basic Supporter'}).click();
        await section.locator('[data-testid="select-option"]', {hasText: 'Ultimate Starlight Diamond Tier'}).click();

        await section.getByRole('button', {name: 'Save'}).click();

        await expect(section.getByText('Specific tiers')).toHaveCount(1);

        expect(lastApiRequests.editSettings?.body).toEqual({
            settings: [
                {key: 'default_content_visibility', value: 'tiers'},
                {key: 'default_content_visibility_tiers', value: JSON.stringify(responseFixtures.tiers.tiers.slice(1).map(tier => tier.id))}
            ]
        });
    });
});
