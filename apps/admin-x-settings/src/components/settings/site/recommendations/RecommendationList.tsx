import Avatar from '../../../../admin-x-ds/global/Avatar';
import Button from '../../../../admin-x-ds/global/Button';
import ConfirmationModal from '../../../../admin-x-ds/global/modal/ConfirmationModal';
import NiceModal from '@ebay/nice-modal-react';
import NoValueLabel from '../../../../admin-x-ds/global/NoValueLabel';
import React from 'react';
import Table from '../../../../admin-x-ds/global/Table';
import TableCell from '../../../../admin-x-ds/global/TableCell';
import TableRow from '../../../../admin-x-ds/global/TableRow';
import {Recommendation} from '../../../../api/recommendations';

interface RecommendationListProps {
    recommendations: Recommendation[]
}

const RecommendationItem: React.FC<{recommendation: Recommendation}> = ({recommendation}) => {
    const action = (
        <Button color='red' label='Remove' link onClick={() => {
            NiceModal.show(ConfirmationModal, {
                title: 'Remove recommendation',
                prompt: <>
                    <p>Your recommendation <strong>Lenny Nesletter</strong> will no longer be visible to your audience.</p>
                </>,
                okLabel: 'Remove',
                onOk: async (modal) => {
                    modal?.remove();
                }
            });
        }} />
    );

    const showDetails = () => {};

    return (
        <TableRow action={action} hideActions>
            <TableCell onClick={showDetails}>
                <div className='group flex items-center gap-3 hover:cursor-pointer'>
                    <Avatar image='https://substackcdn.com/image/fetch/w_96,h_96,c_fill,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff3f2b2ad-681f-45e1-9496-db80f45e853d_403x403.png' labelColor='white' />
                    <div className={`flex grow flex-col`}>
                        <span className='mb-0.5 font-medium'>{recommendation.title}</span>
                        <span className='text-xs leading-snug text-grey-700'>{recommendation.reason || 'No reason'}</span>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
};

const RecommendationList: React.FC<RecommendationListProps> = ({recommendations}) => {
    if (recommendations.length) {
        return <Table>
            {recommendations.map(recommendation => <RecommendationItem key={recommendation.id} recommendation={recommendation} />)}
        </Table>;
    } else {
        return <NoValueLabel icon='mail-block'>
            No recommendations yet.
        </NoValueLabel>;
    }
};

export default RecommendationList;